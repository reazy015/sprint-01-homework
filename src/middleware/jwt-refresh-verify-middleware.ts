import {Request, Response, NextFunction} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {SETTINGS} from '../shared/configs'
import {UserViewModel} from '../types/user'
import jwt from 'jsonwebtoken'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

export const jwtRefreshVerifyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies['refreshToken']

  if (!refreshToken) {
    res.sendStatus(511)
    return
  }

  const inBlackList = await usersQueryRepository.refreshTokenBlackListCheck(refreshToken)

  if (inBlackList) {
    res.sendStatus(512)
    return
  }

  let verifiedUser

  try {
    verifiedUser = jwt.verify(refreshToken, SETTINGS.SECRET_KEY) as UserViewModel & {
      exp: number
      iat: number
    }
  } catch (error) {
    res.status(513).send(error)
    return
  }

  if (!verifiedUser || verifiedUser.exp < new Date().getTime() / 1000) {
    res.sendStatus(514)
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
