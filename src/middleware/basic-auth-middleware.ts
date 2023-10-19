import {NextFunction, Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {authRepository} from '../repositories/auth-repository'

export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization

  if (!auth) {
    res.status(HTTP_STATUSES.UNAUTH).send('No auth credentials')
    return
  }

  const isValidBasicAuthCredentials = await authRepository.isValidBasicAuth(auth)

  if (isValidBasicAuthCredentials) {
    next()
  } else {
    res.status(HTTP_STATUSES.UNAUTH).send('Invalid credentials')
  }
}
