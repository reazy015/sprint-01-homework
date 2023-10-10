import express, {Response} from 'express'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {HTTP_STATUSES} from '../utils/constants'
import {validateQueryParamsWithDefault} from '../middleware/user-query-check-schema'
import {
  CustomQueryRequest,
  CustomRequest,
  NewUserCredentials,
  UserQueryParams,
  WithPaging,
} from '../types/common'
import {UserViewModel} from '../types/user'
import {usersQueryRepository} from '../data-access-layer/query/users-query-repository'
import {usersService} from '../busines-logic-layer/users-service'
import {newUserValidateMiddleware} from '../middleware/new-user-validate.middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {validIdCheckMiddleware} from '../middleware/valid-id-check-middleware'
import {usersCommandRepository} from '../data-access-layer/command/users-command-repository'

export const getUsersRouter = () => {
  const router = express.Router()

  router.get(
    '/',
    basicAuthMiddleware,
    validateQueryParamsWithDefault,
    async (req: CustomQueryRequest<UserQueryParams>, res: Response<WithPaging<UserViewModel>>) => {
      const users = await usersQueryRepository.getUsers(req.query)

      res.status(HTTP_STATUSES.OK).send(users)
    },
  )

  router.post(
    '/',
    basicAuthMiddleware,
    newUserValidateMiddleware,
    validationErrorMiddleware,
    async (req: CustomRequest<NewUserCredentials>, res: Response<UserViewModel>) => {
      const newUserId = await usersService.addNewUser(req.body)

      if (!newUserId) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      const createdUser = await usersQueryRepository.getSingleUserById(newUserId)

      if (!createdUser) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).send(createdUser)
    },

    router.delete(
      '/:id',
      validIdCheckMiddleware(),
      validationErrorMiddleware,
      async (req: CustomRequest<{userId: string}>, res: Response) => {
        const user = await usersQueryRepository.getSingleUserById(req.params.id)

        if (!user) {
          res.sendStatus(HTTP_STATUSES.NOT_FOUND)
          return
        }

        const deleted = await usersCommandRepository.deleteUserById(req.params.id)

        if (!deleted) {
          res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
      },
    ),
  )

  return router
}
