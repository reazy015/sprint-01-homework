import express from 'express'
import {videoRepositry} from '../data-access-layer/video-repository'
import {blogsRepository} from '../data-access-layer/blogs-repository'
import {postsRepository} from '../data-access-layer/post-repository'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/testing/all-data', (_, res) => {
    videoRepositry.deleteAllVideos()
    blogsRepository.deleteAllBlogs()
    postsRepository.deleteAllPosts()
    res.sendStatus(204)
  })

  return router
}
