import {Request, Response, NextFunction} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {SETTINGS} from '../shared/configs'
import {UserViewModel} from '../types/user'
import jwt from 'jsonwebtoken'
import {usersQueryRepository} from '../repositories/query/users-query-repository'
import {cryptoService} from '../application/crypto-service'

export const jwtRefreshVerifyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies['refreshToken']

  if (!refreshToken) {
    res.sendStatus(HTTP_STATUSES.UNAUTH)
    return
  }

  let verifiedUser

  try {
    verifiedUser = jwt.verify(refreshToken, SETTINGS.SECRET_KEY) as UserViewModel & {
      exp: number
      iat: number
    }
  } catch (error) {
    res.status(HTTP_STATUSES.UNAUTH).send(error)
    return
  }

  const inDeviceAuthSessionList =
    await usersQueryRepository.checkRefreshTokenIsInAuthDeviceSessionList(
      verifiedUser.iat,
      verifiedUser.id,
    )

  if (!verifiedUser || verifiedUser.exp < new Date().getTime() / 1000 || !inDeviceAuthSessionList) {
    res.sendStatus(HTTP_STATUSES.UNAUTH)
    return
  }

  req.context = {
    userId: verifiedUser.id,
    email: verifiedUser.email,
    login: verifiedUser.login,
    refreshTokenExp: verifiedUser.exp,
    refreshTokenIat: verifiedUser.iat,
  }
  next()
}
