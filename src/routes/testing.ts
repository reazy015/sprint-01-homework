import express from 'express'
import {blogsCommandRepository} from '../repositories/command/blogs-command-repository'
import {commentsCommandRespository} from '../repositories/command/comments-command-repository'
import {postsCommandRepository} from '../repositories/command/posts-command-repository'
import {usersCommandRepository} from '../repositories/command/users-command-repository'
import {videoRepositry} from '../repositories/video-repository'
import {HTTP_STATUSES} from '../utils/constants'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/', async (_, res) => {
    videoRepositry.deleteAllVideos()
    const allBlogsDeleted = await blogsCommandRepository.deleteAllBlogs()
    const allPostsDeleted = await postsCommandRepository.deleteAllPosts()
    const allUsersDeleted = await usersCommandRepository.deleteAllUsers()
    const allCommentsDeleted = await commentsCommandRespository.deleteAllComments()
    const allDeviceAuthSessionDeleted = await usersCommandRepository.deleteAllDeviceAuthSessions()
    const blackListCleared = await usersQueryRepository.deleteBlackListRecords()

    if (
      allBlogsDeleted &&
      allPostsDeleted &&
      allUsersDeleted &&
      allCommentsDeleted &&
      allDeviceAuthSessionDeleted &&
      blackListCleared
    ) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
      return
    }

    res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
  })

  return router
}
