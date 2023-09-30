import express from 'express'
import {videoRepositry} from '../data-access-layer/video-repository'
import {blogsRepository} from '../data-access-layer/blogs-repository'
import {postsRepository} from '../data-access-layer/post-repository'
import {HTTP_STATUSES} from '../utils/constants'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/', async (_, res) => {
    videoRepositry.deleteAllVideos()
    const allBlogsDeleted = await blogsRepository.deleteAllBlogs()
    const allPostsDeleted = await postsRepository.deleteAllPosts()

    if (allBlogsDeleted && allPostsDeleted) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
      return
    }

    res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
  })

  return router
}
