import express, {Request, Response} from 'express'
import {postsRepository} from '../data-access-layer/post-repository'
import {PostInputModel, PostViewModel} from '../types/post'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {postValidateMiddleware} from '../middleware/post-validate-middleware-'
import {CustomRequest, IdURIParam} from '../types/common'
import {HTTP_STATUSES} from '../utils/constants'

export const getPostsRouter = () => {
  const router = express.Router()

  router.get('/', async (_, res: Response<PostViewModel[]>) => {
    const posts = await postsRepository.getAllPosts()

    res.status(HTTP_STATUSES.OK).json(posts)
  })

  router.get('/:id', async (req: Request<IdURIParam>, res: Response<PostViewModel>) => {
    const postId = req.params.id

    const post = await postsRepository.getPostById(postId)

    if (!post) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    res.status(HTTP_STATUSES.OK).send(post)
  })

  router.post(
    '/',
    basicAuthMiddleware,
    postValidateMiddleware(),
    validationErrorMiddleware,
    async (req: CustomRequest<PostInputModel>, res: Response<PostViewModel>) => {
      const newPostId = await postsRepository.addPost(req.body)

      if (!newPostId) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      const newPost = await postsRepository.getPostById(newPostId)

      if (!newPost) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).json(newPost)
    },
  )

  router.put(
    '/:id',
    basicAuthMiddleware,
    postValidateMiddleware(),
    validationErrorMiddleware,

    async (req: CustomRequest<PostInputModel, IdURIParam>, res: Response) => {
      const postId = req.params.id

      const post = await postsRepository.getPostById(postId)

      if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      const postUpdated = await postsRepository.updatePost(postId, req.body)

      if (!postUpdated) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.delete('/:id', basicAuthMiddleware, async (req: Request<IdURIParam>, res: Response) => {
    const id = req.params.id

    const blog = await postsRepository.getPostById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    const deleteResult = await postsRepository.deletePost(id)

    if (!deleteResult) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
