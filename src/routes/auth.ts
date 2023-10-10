import express, {Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {CustomRequest} from '../types/common'
import {AuthLoginInput} from '../types/auth'

export const getAuthRouter = () => {
  const router = express.Router()

  router.post('/login', async (req: CustomRequest<AuthLoginInput>, res: Response) => {
    res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED)
  })

  return router
}
