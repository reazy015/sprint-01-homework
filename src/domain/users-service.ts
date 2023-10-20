import {AuthLoginInput} from '../types/auth'
import {NewUserCredentials} from '../types/common'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {usersCommandRepository} from '../repositories/command/users-command-repository'
import {usersQueryRepository} from '../repositories/query/users-query-repository'
import {mailService} from '../application/mail-service'
import {v4 as uuidv4} from 'uuid'

dotenv.config()

const SECREY_KEY = process.env.SECRET_KEY || 'localhost_temp_secret_key'
const TOKEN_EXPIRES_IN = '1h'

export const usersService = {
  async addNewUser(newUser: NewUserCredentials): Promise<string | null> {
    const {password} = newUser
    const {salt, hash} = await this._getHash(password)
    const createdAt = new Date().toISOString()

    const newUserId = await usersCommandRepository.createUser({...newUser, createdAt}, salt, hash)

    return newUserId
  },
  async checkUserRegistered({loginOrEmail, password}: AuthLoginInput): Promise<boolean> {
    const saltAndHash = await usersQueryRepository.getUserHashAndSaltByEmailOrLogin(loginOrEmail)

    if (!saltAndHash) return false

    const result = await bcrypt.compare(password, saltAndHash.hash)

    return result
  },
  async loginUser({loginOrEmail, password}: AuthLoginInput): Promise<string | null> {
    const user = await usersQueryRepository.getUserByEmailOrLogin(loginOrEmail)

    if (!user) return null

    const userExists = await bcrypt.compare(password, user.hash)

    if (!userExists) return null

    return await jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user.id,
        createdAt: user.createdAt,
      },
      SECREY_KEY,
      {expiresIn: TOKEN_EXPIRES_IN},
    )
  },
  async _getHash(password: string, userSalt?: string): Promise<{salt: string; hash: string}> {
    const roundsNumber = 10
    const salt = userSalt ?? (await bcrypt.genSalt(roundsNumber))

    const hash = await bcrypt.hash(password, roundsNumber)

    return {
      salt,
      hash,
    }
  },
  async registerNewUser({login, password, email}: NewUserCredentials): Promise<boolean> {
    const confirmationCode = uuidv4()
    const {hash, salt} = await this._getHash(password)
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

    const confirmationCode = uuidv4()

    const emailResent = await mailService.sendConfimationEmail(email, confirmationCode)

    return emailResent
  },
}
