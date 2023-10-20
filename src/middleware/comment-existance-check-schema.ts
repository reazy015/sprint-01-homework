import {checkSchema, validationResult} from 'express-validator'
import {NextFunction, Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {commentsQueryRepository} from '../repositories/query/comments-query-repository'

const commentExistanceCheck = checkSchema({
  id: {
    optional: true,
    in: 'params',
    custom: {
      options: async (commentId: string) => {
        const post = await commentsQueryRepository.getCommentById(commentId)
        if (!post) throw new Error('Comment not found')
      },
    },
  },
})

const commentExistsErrorSummary = async (
  req: Request,
  res: Response<{
    errorsMessages: {
      field: string
      message: string
    }[]
  }>,
  next: NextFunction,
) => {
  const errors = await validationResult(req)

  if (!errors.isEmpty()) {
    const errorsMessages = Object.entries(errors.mapped()).map(([key, value]) => ({
      field: key,
      message: value.msg,
    }))

    res.status(HTTP_STATUSES.NOT_FOUND).send({
      errorsMessages,
    })
    return
  }

  next()
}

export const commentExistanceCheckMiddleware = [commentExistanceCheck, commentExistsErrorSummary]
