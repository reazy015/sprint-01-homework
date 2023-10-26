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

export const getAuthRouter = () => {
  const router = express.Router()

  router.post(
    '/login',
    authCredentialsCheck,
    validationErrorMiddleware,
    async (req: CustomRequest<AuthLoginInput>, res: Response<{accessToken: string}>) => {
      const loggedIn = await usersService.loginUser(req.body)

      if (!loggedIn) {
        res.sendStatus(HTTP_STATUSES.UNAUTH)
        return
      }

      const {accessToken, refreshToken} = loggedIn
      res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
      res.status(HTTP_STATUSES.OK).json({accessToken})
    },
  )

  router.get(
    '/me',
    jwtVerifyMiddleware,
    async (req: Request, res: Response<{login: string; email: string; userId: string}>) => {
      res.status(HTTP_STATUSES.OK).send(req.context)
    },
  )

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
    confirmationCodeCheck,
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
    emailResendingCheck,
    validationErrorMiddleware,
    async (req: CustomRequest<{email: string}>, res: Response) => {
      const emailResent = await usersService.resendConfirmationEmail(req.body.email)

      if (!emailResent) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST).json({message: 'Something went wrong'})
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.post('/refresh-token', jwtRefreshVerifyMiddleware, async (req: Request, res: Response) => {
    const loggedIn = await usersService.refreshLoginUser(req.context)

    if (!loggedIn) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
      return
    }

    const {refreshToken, accessToken} = loggedIn

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    res.status(HTTP_STATUSES.OK).send({
      accessToken,
    })
  })

  router.post('/logout', jwtRefreshVerifyMiddleware, async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken']
    const loggedOut = await usersService.logoutUser(refreshToken)

    if (!loggedOut) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
