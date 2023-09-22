import express, {Request, Response} from 'express'
import {Resolutions, Video} from '../types/video'
import {videoRepositry} from '../data-access-layer/video-repository'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {
  getVideoByIdMiddleware,
  postVideoMiddleware,
  putVideoMiddleware,
} from '../middleware/video-validate-middleware'

export const getVideosRouter = () => {
  const router = express.Router()

  router.get('/', (_, res: Response<Video[]>) => {
    res.status(200).json(videoRepositry.getAllVideos())
  })

  router.get(
    '/:id',
    getVideoByIdMiddleware(),
    validationErrorMiddleware,
    (req: Request<{id: string}>, res: Response<Video>) => {
      const id = +req.params.id

      const found = videoRepositry.getVideoById(id)

      if (!found) {
        res.sendStatus(404)
        return
      }

      res.status(200).json(found)
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

      res.status(201).json(createdVideo)
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
        res.status(404)
        return
      }

      res.status(204)
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
        res.sendStatus(404)
        return
      }

      videoRepositry.updateVideo(id, updates)
      res.sendStatus(204)
    },
  )

  return router
}
