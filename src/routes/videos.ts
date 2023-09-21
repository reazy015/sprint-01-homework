import express, {Request, Response} from 'express'
import {Resolutions, Video} from '../types/videos'
import {RESOLUTIONS_STRING} from '../utils/constants'
import {isAvailableResolutionsCorrect} from '../utils/helpers'
import {videoRepositry} from '../data-access-layer/video-repository'

export const getVideosRouter = () => {
  const router = express.Router()

  router.get('/', (_, res: Response<Video[]>) => {
    res.status(200).json(videoRepositry.getAllVideos())
  })

  router.get('/:id', (req: Request<{id: string}>, res: Response<Video>) => {
    const id = +req.params.id

    const found = videoRepositry.getVideoById(id)

    if (!found) {
      res.sendStatus(404)
      return
    }

    res.status(200).json(found)
  })

  router.post(
    '/',
    (
      req: Request<{}, {}, {title: string; author: string; availableResolutions: Resolutions[]}>,
      res: Response<Video | {errorsMessages: {message: string; field: string}[]}>,
    ) => {
      const {title, author, availableResolutions} = req.body
      const errorsMessages: {message: string; field: string}[] = []

      if (!title || title.length > 40) {
        errorsMessages.push({
          message: 'title is required, max length 40',
          field: 'title',
        })
      }

      if (!author || author.length > 20) {
        errorsMessages.push({
          message: 'author is required, max length 20',
          field: 'author',
        })
      }

      if (!availableResolutions || !availableResolutions.length) {
        errorsMessages.push({
          message: 'availableResolutions is required',
          field: 'availableResolutions',
        })
      }

      if (
        availableResolutions &&
        availableResolutions.length &&
        !isAvailableResolutionsCorrect(availableResolutions)
      ) {
        errorsMessages.push({
          message: `availableResolutions has incorrect values, correct types are: ${RESOLUTIONS_STRING}`,
          field: 'availableResolutions',
        })
      }

      if (errorsMessages.length) {
        res.status(400).json({errorsMessages})
        return
      }

      const createdVideoId = videoRepositry.addVideo({
        title,
        author,
        availableResolutions,
        minAgeRestriction: null,
        canBeDownloaded: false,
      })
      const createdVideo = videoRepositry.getVideoById(createdVideoId)

      res.status(201).json(createdVideo)
    },
  )

  router.delete('/:id', (req: Request<{id: string}>, res) => {
    const id = +req.params.id

    const isDeleted = videoRepositry.deleteVideo(id)

    if (!isDeleted) {
      res.status(404)
      return
    }

    res.status(204)
  })

  router.put(
    '/:id',
    (
      req: Request<{id: string}>,
      res: Response<{errorsMessages: {message: string; field: string}[]}>,
    ) => {
      const updates = req.body
      const {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate,
      } = updates
      const id = +req.params.id
      const found = videoRepositry.getVideoById(id)

      if (!found) {
        res.sendStatus(404)
        return
      }

      const errorsMessages = []

      if (typeof canBeDownloaded !== 'boolean') {
        errorsMessages.push({
          message: 'can be only boolean type',
          field: 'canBeDownloaded',
        })
      }

      if (!title || title.length > 40) {
        errorsMessages.push({
          message: 'title is required, max length 40',
          field: 'title',
        })
      }

      if (!author || author.length > 20) {
        errorsMessages.push({
          message: 'author is required, max length 20',
          field: 'author',
        })
      }

      if (!availableResolutions || !availableResolutions.length) {
        errorsMessages.push({
          message: 'availableResolutions is required',
          field: 'availableResolutions',
        })
      }

      if (minAgeRestriction > 18 || minAgeRestriction < 1) {
        errorsMessages.push({
          message: 'minAgeRestriction is incorrect, must be in range 1-18',
          field: 'minAgeRestriction',
        })
      }

      if (typeof publicationDate !== 'string') {
        errorsMessages.push({
          message: 'publicationDate is incorrect, must be a date string in ISO format',
          field: 'publicationDate',
        })
      }

      if (
        availableResolutions &&
        availableResolutions.length &&
        !isAvailableResolutionsCorrect(availableResolutions)
      ) {
        errorsMessages.push({
          message: `availableResolutions has incorrect values, correct types are: ${RESOLUTIONS_STRING}`,
          field: 'availableResolutions',
        })
      }

      if (errorsMessages.length) {
        res.status(400).json({errorsMessages})
        return
      }

      videoRepositry.updateVideo(id, updates)
      res.sendStatus(204)
    },
  )

  return router
}
