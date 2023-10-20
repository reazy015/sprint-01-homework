import express, {NextFunction, Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {CustomRequest, NewUserCredentials} from '../types/common'
import {AuthLoginInput} from '../types/auth'
import {authCredentialsCheck} from '../middleware/auth-credentials-check'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {jwtVerifyMiddleware} from '../middleware/jwt-verify-middleware'
import {EMAIL_REGEXP, newUserValidateMiddleware} from '../middleware/new-user-validate.middleware'
import {usersService} from '../domain/users-service'
import {body} from 'express-validator'
import {confirmationCheckMiddleware} from '../middleware/confirmation-check-middleware'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

export const getAuthRouter = () => {
  const router = express.Router()

  router.post(
    '/login',
    authCredentialsCheck,
    validationErrorMiddleware,
    async (req: CustomRequest<AuthLoginInput>, res: Response<{accessToken: string}>) => {
      const accessToken = await usersService.loginUser(req.body)

      if (!accessToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTH)
        return
      }

      res.status(HTTP_STATUSES.OK).json({accessToken})
    },
  )

  router.get('/me', jwtVerifyMiddleware, async (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK).send(req.context.userId)
  })

  router.post(
    '/registration',
    newUserValidateMiddleware,
    validationErrorMiddleware,
    confirmationCheckMiddleware,
    async (req: CustomRequest<NewUserCredentials>, res: Response) => {
      const code = await usersService.registerNewUser(req.body)

      if (!code) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.post(
    '/registration-confirmation',
    body('code').notEmpty().withMessage('invalid code'),
    validationErrorMiddleware,
    async (req: CustomRequest<{code: string}>, res: Response) => {
      const confirmed = await usersService.confirmUserRegistration(req.body.code)

      if (!confirmed) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.post(
    '/registration-email-resending',
    body('email').matches(EMAIL_REGEXP).withMessage('Incorrect email'),
    async (req: CustomRequest<{email: string}>, res: Response, next: NextFunction) => {
      const confirmed = await usersQueryRepository.isConfirmedUser(req.body.email)

      if (confirmed) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST).json({message: 'User already confirmed'})
        return
      }
      console.log(true)
      next()
    },
    validationErrorMiddleware,
    async (req: CustomRequest<{email: string}>, res: Response) => {
      const emailResent = await usersService.resendConfirmationEmail(req.body.email)

      if (!emailResent) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST).json({message: 'Something went wrong'})
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  return router
}
