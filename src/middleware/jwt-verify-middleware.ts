import {NextFunction, Response, Request} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {UserViewModel} from '../types/user'
import jwt from 'jsonwebtoken'
import {SETTINGS} from '../shared/configs'

export const jwtVerifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_STATUSES.UNAUTH)
    return
  }
  const bearerToken = req.headers.authorization.split(' ')[1]

  if (!bearerToken) {
    res.sendStatus(HTTP_STATUSES.UNAUTH)
    return
  }

  let verifiedUser

  try {
    verifiedUser = jwt.verify(bearerToken, SETTINGS.SECRET_KEY) as UserViewModel
  } catch (error) {
    res.status(HTTP_STATUSES.UNAUTH).send(error)
    return
  }

  if (!verifiedUser) {
    res.sendStatus(HTTP_STATUSES.UNAUTH)
    return
  }

  req.context = {
    userId: verifiedUser.id,
    email: verifiedUser.email,
    login: verifiedUser.login,
  }
  next()
}
