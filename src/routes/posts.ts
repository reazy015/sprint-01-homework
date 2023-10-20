import express, {Request, Response} from 'express'
import {PostInputModel, PostViewModel} from '../types/post'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {
  postValidateMiddleware,
  queryPostValidateMiddleware,
} from '../middleware/post-validate-middleware-'
import {
  CommentQueryParams,
  CustomQueryRequest,
  CustomRequest,
  IdURIParam,
  PostQueryParams,
  WithPaging,
} from '../types/common'
import {HTTP_STATUSES} from '../utils/constants'
import {body} from 'express-validator'
import {commentsService} from '../domain/comments-service'
import {jwtVerifyMiddleware} from '../middleware/jwt-verify-middleware'
import {postExistanceCheckMiddleware} from '../middleware/post-existance-check-schema'
import {validateQueryParamsWithDefault} from '../middleware/user-query-check-schema'
import {validIdCheckMiddleware} from '../middleware/valid-id-check-middleware'
import {postsCommandRepository} from '../repositories/command/posts-command-repository'
import {commentsQueryRepository} from '../repositories/query/comments-query-repository'
import {postQueryRepository} from '../repositories/query/posts-query-repository'
import {CommentViewModel} from '../types/comment'
export const getPostsRouter = () => {
  const router = express.Router()

  router.get(
    '/',
    // queryPostValidateMiddleware,
    // validationErrorMiddleware,
    async (
      req: CustomQueryRequest<Partial<PostQueryParams>>,
      res: Response<WithPaging<PostViewModel>>,
    ) => {
      const posts = await postQueryRepository.getAllPosts(req.query)

      res.status(HTTP_STATUSES.OK).json(posts)
    },
  )

  router.get(
    '/:id',
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    async (req: Request<IdURIParam>, res: Response<PostViewModel>) => {
      const postId = req.params.id

      const post = await postQueryRepository.getPostById(postId)

      if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      res.status(HTTP_STATUSES.OK).send(post)
    },
  )

  router.get(
    '/:id/comments',
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    ...postExistanceCheckMiddleware,
    validateQueryParamsWithDefault,
    async (req: CustomQueryRequest<CommentQueryParams>, res: Response) => {
      const comments = await postQueryRepository.getCommentsByPostId(req.params.id, req.query)

      res.status(HTTP_STATUSES.OK).send(comments)
    },
  )

  router.post(
    '/',
    basicAuthMiddleware,
    postValidateMiddleware,
    validationErrorMiddleware,
    async (req: CustomRequest<PostInputModel>, res: Response<PostViewModel>) => {
      const newPostId = await postsCommandRepository.addPost(req.body)

      if (!newPostId) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      const newPost = await postQueryRepository.getPostById(newPostId)

      if (!newPost) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).json(newPost)
    },
  )

  router.post(
    '/:id/comments',
    validIdCheckMiddleware(),
    ...postExistanceCheckMiddleware,
    validationErrorMiddleware,
    jwtVerifyMiddleware,

    body('content')
      .notEmpty()
      .isLength({min: 20, max: 300})
      .withMessage('Incorrect comment content'),
    validationErrorMiddleware,

    async (req: CustomRequest<{content: string}>, res: Response<CommentViewModel>) => {
      const newCommentId = await commentsService.createNewComment({
        userId: req.context.userId,
        postId: req.params.id,
        content: req.body.content,
      })

      if (!newCommentId) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      const comment = await commentsQueryRepository.getCommentById(newCommentId)

      if (!comment) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).send(comment)
    },
  )

  router.put(
    '/:id',
    basicAuthMiddleware,
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    ...postExistanceCheckMiddleware,
    postValidateMiddleware,
    validationErrorMiddleware,
    async (req: CustomRequest<PostInputModel, IdURIParam>, res: Response) => {
      const postId = req.params.id

      const post = await postQueryRepository.getPostById(postId)

      if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      const postUpdated = await postsCommandRepository.updatePost(postId, req.body)

      if (!postUpdated) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.delete('/:id', basicAuthMiddleware, async (req: Request<IdURIParam>, res: Response) => {
    const id = req.params.id

    const blog = await postQueryRepository.getPostById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    const deleteResult = await postsCommandRepository.deletePost(id)

    if (!deleteResult) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
