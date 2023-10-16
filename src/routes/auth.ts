import express, {Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {CustomRequest} from '../types/common'
import {AuthLoginInput} from '../types/auth'
import {authCredentialsCheck} from '../middleware/auth-credentials-check'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {usersService} from '../busines-logic-layer/users-service'
import {jwtVerifyMiddleware} from '../middleware/jwt-verify-middleware'

export const getAuthRouter = () => {
  const router = express.Router()

  router.post(
    '/login',
    authCredentialsCheck,
    validationErrorMiddleware,
    async (req: CustomRequest<AuthLoginInput>, res: Response) => {
      const accessToken = await usersService.loginUser(req.body)

      if (!accessToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTH)
        return
      }

      res.status(HTTP_STATUSES.OK).send({accessToken})
    },
  )

  router.get('/me', jwtVerifyMiddleware, async (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK).send(req.context!.userId)
  })
  return router
}
