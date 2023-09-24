import express from 'express'
import {videoRepositry} from '../data-access-layer/video-repository'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/testing/all-data', (_, res) => {
    videoRepositry.deleteAllVideos()
    res.status(204)
  })

  return router
}
