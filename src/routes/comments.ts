import express, {Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {validIdCheckMiddleware} from '../middleware/valid-id-check-middleware'
import {CustomRequest} from '../types/common'
import {body} from 'express-validator'
import {commentsService} from '../domain/comments-service'
import {commentBelongsToMiddleware} from '../middleware/comment-belongs-to-middleware'
import {commentExistanceCheckMiddleware} from '../middleware/comment-existance-check-schema'
import {jwtVerifyMiddleware} from '../middleware/jwt-verify-middleware'
import {commentsQueryRepository} from '../repositories/query/comments-query-repository'
import {CommentViewModel} from '../types/comment'

export const getCommentsRouter = () => {
  const router = express.Router()

  router.get(
    '/:id',
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    async (req: CustomRequest<{}, {id: string}>, res: Response<CommentViewModel>) => {
      const comment = await commentsQueryRepository.getCommentById(req.params.id)

      if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      res.status(HTTP_STATUSES.OK).send(comment)
    },
  )

  router.put(
    '/:id',
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    ...commentExistanceCheckMiddleware,
    jwtVerifyMiddleware,
    commentBelongsToMiddleware,
    body('content')
      .notEmpty()
      .isLength({min: 20, max: 300})
      .withMessage('Incorrect comment content'),
    validationErrorMiddleware,
    async (req: CustomRequest<{content: string}, {id: string}>, res: Response) => {
      const updated = await commentsService.updateCommentById(req.params.id, req.body.content)

      if (!updated) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.delete(
    '/:id',
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    ...commentExistanceCheckMiddleware,
    jwtVerifyMiddleware,
    commentBelongsToMiddleware,
    async (req: CustomRequest<{}, {id: string}>, res: Response) => {
      const deleted = await commentsService.deleteCommentById(req.params.id)

      if (!deleted) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  return router
}
