import express, {Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {CustomRequest, NewUserCredentials} from '../types/common'
import {AuthLoginInput} from '../types/auth'
import {authCredentialsCheck} from '../middleware/auth-credentials-check'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {jwtVerifyMiddleware} from '../middleware/jwt-verify-middleware'
import {newUserValidateMiddleware} from '../middleware/new-user-validate.middleware'
import {usersService} from '../domain/users-service'
import {confirmationCheckMiddleware} from '../middleware/confirmation-check-middleware'
import {confirmationCodeCheck} from '../middleware/confirmation-code-check'
import {emailResendingCheck} from '../middleware/email-resending-check'
import {jwtRefreshVerifyMiddleware} from '../middleware/jwt-refresh-verify-middleware'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

export const getSecurityRouter = () => {
  const router = express.Router()

  router.get(
    '/devices',
    jwtRefreshVerifyMiddleware,
    (req, res, next) => {
      const currentDate = new Date().getTime() / 1000
      if (req.context.refreshTokenExp && req.context.refreshTokenExp < currentDate) {
        res.sendStatus(HTTP_STATUSES.UNAUTH)
        return
      }

      next()
    },
    async (req, res) => {
      const deviceAuthSessions = await usersQueryRepository.getUserDeviceAuthSessions(
        req.context.userId,
      )

      res.status(HTTP_STATUSES.OK).send(deviceAuthSessions)
    },
  )

  return router
}
