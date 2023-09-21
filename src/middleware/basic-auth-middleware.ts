import {NextFunction, Request, Response} from 'express'
import {authRepository} from '../data-access-layer/auth-repository'

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization

  if (!auth) {
    res.status(401).send('No auth credentials')
    return
  }

  const isValidBasicAuthCredentials = authRepository.isValidBasicAuth(auth)

  if (isValidBasicAuthCredentials) {
    next()
  } else {
    res.status(401).send('Invalid credentials')
  }
}
