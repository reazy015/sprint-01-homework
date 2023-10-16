import express from 'express'
import {videoRepositry} from '../data-access-layer/video-repository'
import {HTTP_STATUSES} from '../utils/constants'
import {blogsCommandRepository} from '../data-access-layer/command/blogs-command-repository'
import {postsCommandRepository} from '../data-access-layer/command/posts-command-repository'
import {usersCommandRepository} from '../data-access-layer/command/users-command-repository'
import {commentsCommandRespository} from '../data-access-layer/command/comments-command-repository'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/', async (_, res) => {
    videoRepositry.deleteAllVideos()
    const allBlogsDeleted = await blogsCommandRepository.deleteAllBlogs()
    const allPostsDeleted = await postsCommandRepository.deleteAllPosts()
    const allUsersDeleted = await usersCommandRepository.deleteAllUsers()
    const allCommentsDeleted = await commentsCommandRespository.deleteAllComments()

    if (allBlogsDeleted && allPostsDeleted && allUsersDeleted && allCommentsDeleted) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
      return
    }

    res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
  })

  return router
}
