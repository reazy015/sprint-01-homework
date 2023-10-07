import express from 'express'
import {videoRepositry} from '../data-access-layer/video-repository'
import {HTTP_STATUSES} from '../utils/constants'
import {blogsCommandRepository} from '../data-access-layer/command/blogs-command-repository'
import {postsCommandRepository} from '../data-access-layer/command/posts-command-repository'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/', async (_, res) => {
    videoRepositry.deleteAllVideos()
    const allBlogsDeleted = await blogsCommandRepository.deleteAllBlogs()
    const allPostsDeleted = await postsCommandRepository.deleteAllPosts()

    if (allBlogsDeleted && allPostsDeleted) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
      return
    }

    res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
  })

  return router
}
