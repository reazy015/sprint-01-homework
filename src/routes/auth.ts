import express, {Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {CustomRequest} from '../types/common'
import {AuthLoginInput} from '../types/auth'
import {authCredentialsCheck} from '../middleware/auth-credentials-check'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {usersService} from '../busines-logic-layer/users-service'

export const getAuthRouter = () => {
  const router = express.Router()

  router.post(
    '/login',
    authCredentialsCheck,
    validationErrorMiddleware,
    async (req: CustomRequest<AuthLoginInput>, res: Response) => {
      const isUserRegistered = await usersService.checkUserRegistered(req.body)

      if (!isUserRegistered) {
        res.sendStatus(HTTP_STATUSES.UNAUTH)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  return router
}
