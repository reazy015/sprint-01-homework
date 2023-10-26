import {Response, NextFunction} from 'express'
import {CustomRequest, NewUserCredentials} from '../types/common'
import {authQueryRepository} from '../repositories/query/auth-query-repository'
import {HTTP_STATUSES} from '../utils/constants'
import {checkSchema} from 'express-validator'

export const emailRegistrationCheck = checkSchema({
  email: {
    options: {
      custom: (email: string) => {},
    },
  },
})
export const confirmationCheckMiddleware = async (
  req: CustomRequest<NewUserCredentials>,
  res: Response,
  next: NextFunction,
) => {
  const user = await authQueryRepository.getNoneConfirmedUserByEmailOrLogin({
    email: req.body.email,
    login: req.body.login,
  })

  if (!user) {
    return next()
  }

  if (new Date(user.expiresIn!) > new Date()) {
    res.status(HTTP_STATUSES.BAD_REQUEST).json({
      message: 'Confirmation code sent, please check your email and try a bit later',
    })
    return
  }

  if (user.confirmed) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST).json({
      message: 'User already confirmed',
    })
    return
  }

  next()
}
