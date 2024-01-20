import express, {Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {jwtRefreshVerifyMiddleware} from '../middleware/jwt-refresh-verify-middleware'
import {usersQueryRepository} from '../repositories/query/users-query-repository'
import {deviceAuthSession} from '../middleware/device-auth-session'

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

  router.delete(
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
      const deviceAuthSessions = await usersQueryRepository.deleteAllDeviceAuthSessions(
        req.context.refreshTokenExp!,
        req.context.userId,
      )

      res.status(HTTP_STATUSES.NO_CONTENT).send(deviceAuthSessions)
    },
  )

  router.delete(
    '/devices/:deviceId',
    jwtRefreshVerifyMiddleware,
    async (req: Request<{deviceId: string}>, res, next) => {
      const currentDate = new Date().getTime() / 1000
      if (req.context.refreshTokenExp && req.context.refreshTokenExp < currentDate) {
        res.sendStatus(HTTP_STATUSES.UNAUTH)
        return
      }

      const userId = await usersQueryRepository.getDeviceAuthSessionUserId(req.params.deviceId)

      if (!userId) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      if (userId !== req.context.userId) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN)
        return
      }

      next()
    },
    async (req: Request<{deviceId: string}>, res) => {
      const deviceAuthSessions = await usersQueryRepository.deleteSingleDeviceAuthSession(
        req.params.deviceId,
      )

      res.status(HTTP_STATUSES.NO_CONTENT).send(deviceAuthSessions)
    },
  )

  return router
}
