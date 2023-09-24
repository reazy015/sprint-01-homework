import {NextFunction, Request, Response} from 'express'
import {authRepository} from '../data-access-layer/auth-repository'
import {HTTP_STATUSES} from '../utils/constants'

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization

  if (!auth) {
    res.status(HTTP_STATUSES.UNAUTH).send('No auth credentials')
    return
  }

  const isValidBasicAuthCredentials = authRepository.isValidBasicAuth(auth)

  if (isValidBasicAuthCredentials) {
    next()
  } else {
    res.status(HTTP_STATUSES.UNAUTH).send('Invalid credentials')
  }
}
