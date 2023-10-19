import {HTTP_STATUSES} from './../utils/constants'
import express, {Request, Response} from 'express'
import {Resolutions, Video} from '../types/video'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {
  getVideoByIdMiddleware,
  postVideoMiddleware,
  putVideoMiddleware,
} from '../middleware/video-validate-middleware'
import {videoRepositry} from '../repositories/video-repository'

export const getVideosRouter = () => {
  const router = express.Router()

  router.get('/', (_, res: Response<Video[]>) => {
    res.status(HTTP_STATUSES.OK).json(videoRepositry.getAllVideos())
  })

  router.get(
    '/:id',
    getVideoByIdMiddleware(),
    validationErrorMiddleware,
    (req: Request<{id: string}>, res: Response<Video>) => {
      const id = +req.params.id

      const found = videoRepositry.getVideoById(id)

      if (!found) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      res.status(HTTP_STATUSES.OK).json(found)
    },
  )

  router.post(
    '/',
    postVideoMiddleware(),
    validationErrorMiddleware,
    (
      req: Request<{}, {}, {title: string; author: string; availableResolutions: Resolutions[]}>,
      res: Response<Video | {errorsMessages: {message: string; field: string}[]}>,
    ) => {
      const {title, author, availableResolutions} = req.body

      const {id} = videoRepositry.addVideo({
        title,
        author,
        availableResolutions,
        minAgeRestriction: null,
        canBeDownloaded: false,
      })
      const createdVideo = videoRepositry.getVideoById(id)

      res.status(HTTP_STATUSES.CREATED).json(createdVideo)
    },
  )

  router.delete(
    '/:id',
    getVideoByIdMiddleware(),
    validationErrorMiddleware,
    (req: Request<{id: string}>, res) => {
      const id = +req.params.id

      const isDeleted = videoRepositry.deleteVideo(id)

      if (!isDeleted) {
        res.status(HTTP_STATUSES.NOT_FOUND)
        return
      }

      res.status(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.put(
    '/:id',
    getVideoByIdMiddleware(),
    putVideoMiddleware(),
    validationErrorMiddleware,
    (
      req: Request<{id: string}>,
      res: Response<{errorsMessages: {message: string; field: string}[]}>,
    ) => {
      const updates = req.body
      const id = +req.params.id
      const found = videoRepositry.getVideoById(id)

      if (!found) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      videoRepositry.updateVideo(id, updates)
      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  return router
}
