import {NextFunction, Response, Request} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import dotenv from 'dotenv'
import {UserViewModel} from '../types/user'
import jwt from 'jsonwebtoken'

dotenv.config()
const SECREY_KEY = process.env.SECRET_KEY || 'localhost_temp_secret_key'

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
    verifiedUser = (await jwt.verify(bearerToken, SECREY_KEY)) as UserViewModel
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
  }
  next()
}
