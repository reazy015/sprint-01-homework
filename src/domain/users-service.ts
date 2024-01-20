import {AuthLoginInput} from '../types/auth'
import {NewUserCredentials} from '../types/common'
import {usersCommandRepository} from '../repositories/command/users-command-repository'
import {usersQueryRepository} from '../repositories/query/users-query-repository'
import {mailService} from '../application/mail-service'
import {cryptoService} from '../application/crypto-service'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const usersService = {
  async addNewUser(newUser: NewUserCredentials): Promise<string | null> {
    const {password} = newUser
    const {salt, hash} = await cryptoService.getHash(password)
    const createdAt = new Date().toISOString()

    const newUserId = await usersCommandRepository.createUser({...newUser, createdAt}, salt, hash)

    return newUserId
  },
  async checkUserRegistered({loginOrEmail, password}: AuthLoginInput): Promise<boolean> {
    const saltAndHash = await usersQueryRepository.getUserHashAndSaltByEmailOrLogin(loginOrEmail)

    if (!saltAndHash) return false

    const result = await cryptoService.verifyPassword(password, saltAndHash.hash)

    return result
  },
  async loginUser(
    {loginOrEmail, password}: AuthLoginInput,
    userAgent = 'unknown',
    ip: string,
  ): Promise<{accessToken: string; refreshToken: string} | null> {
    const user = await usersQueryRepository.getUserByEmailOrLogin(loginOrEmail)

    if (!user) return null

    const userExists = await cryptoService.verifyPassword(password, user.hash)

    if (!userExists) return null

    const accessToken = cryptoService.getJWTToken({
      login: user.login,
      email: user.email,
      id: user.id,
    })

    const deviceId = crypto.randomUUID()

    const refreshToken = cryptoService.getJWTToken(
      {
        login: user.login,
        email: user.email,
        id: user.id,
        deviceId,
      },
      '20s',
    )

    if (!accessToken || !refreshToken) {
      return null
    }

    const decoded = cryptoService.getJWTTokenPayload(refreshToken)

    if (!decoded) {
      return null
    }

    const deviceAuthSessionSaved = usersCommandRepository.addDeviceAuthSession(
      decoded.iat,
      decoded.exp,
      user.id,
      ip,
      userAgent,
      deviceId,
    )

    if (!deviceAuthSessionSaved) {
      return null
    }

    return {
      accessToken,
      refreshToken,
    }
  },
  async logoutUser(refreshToken: string): Promise<boolean> {
    // const addToBlackList = await usersCommandRepository.addRefreshTokenToBlackList(refreshToken)

    // return addToBlackList
    const oldDecoded = cryptoService.getJWTTokenPayload(refreshToken)

    const deviceAuthSessionRemoved = await usersCommandRepository.deleteSingleDeviceAuthSession(
      oldDecoded.iat,
    )

    return deviceAuthSessionRemoved
  },
  async refreshLoginUser(
    user: {
      userId: string
      email: string
      login: string
    },
    oldRefreshToken: string,
  ): Promise<{accessToken: string; refreshToken: string} | null> {
    // await usersCommandRepository.addRefreshTokenToBlackList(oldRefreshToken)

    const accessToken = cryptoService.getJWTToken({
      login: user.login,
      email: user.email,
      id: user.userId,
    })

    const refreshToken = cryptoService.getJWTToken(
      {
        login: user.login,
        email: user.email,
        id: user.userId,
      },
      '40s',
    )

    // const addToBlackList = await usersCommandRepository.addRefreshTokenToBlackList(oldRefreshToken)

    if (!accessToken || !refreshToken) {
      return null
    }

    const decoded = cryptoService.getJWTTokenPayload(refreshToken)
    const oldDecoded = cryptoService.getJWTTokenPayload(oldRefreshToken)

    if (!decoded || !oldDecoded) {
      return null
    }

    const deviceAuthSessionUpdated = usersCommandRepository.updateDeviceAuthSession(
      oldDecoded.iat,
      decoded.iat,
    )

    if (!deviceAuthSessionUpdated) {
      return null
    }

    return {
      accessToken,
      refreshToken,
    }
  },
  async registerNewUser({login, password, email}: NewUserCredentials): Promise<boolean> {
    const confirmationCode = cryptoService.getConfirmationCode()
    const {hash, salt} = await cryptoService.getHash(password)
    const createdAt = new Date().toISOString()
    const expiresIn = new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toISOString()

    const addNewNoneConfirmedUser = await usersCommandRepository.createNoneConfirmedUser({
      login,
      email,
      createdAt,
      hash,
      salt,
      confirmationCode,
      expiresIn,
      confirmed: false,
      confirmationSentDate: createdAt,
    })

    if (!addNewNoneConfirmedUser) {
      return false
    }

    const emailSent = await mailService.sendConfimationEmail(email, confirmationCode)

    if (!emailSent) {
      await usersCommandRepository.deleteNoneConfirmedUserByConfirmationCode(confirmationCode)
      return false
    }

    return true
  },
  async confirmUserRegistration(code: string): Promise<boolean> {
    const userConfirmed = await usersCommandRepository.verifyAndConfirmUser(code)

    return userConfirmed
  },
  async resendConfirmationEmail(email: string): Promise<boolean> {
    const user = await usersQueryRepository.getUserByEmailOrLogin(email)

    if (!user) {
      return false
    }

    const confirmationCode = cryptoService.getConfirmationCode()

    const emailResent = await mailService.sendConfimationEmail(email, confirmationCode)

    if (emailResent) {
      await usersCommandRepository.updateUserConfirmationCodeByEmail(email, confirmationCode)
    }

    return emailResent
  },
}
