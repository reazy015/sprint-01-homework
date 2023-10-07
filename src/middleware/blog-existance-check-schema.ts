import {checkSchema, validationResult} from 'express-validator'
import {POST_ERROR_MESSAGES, POST_VALIDATION_FIELDS} from './constants'
import {blogsQueryRepository} from '../data-access-layer/query/blogs-query-repository'
import {NextFunction, Request, Response} from 'express'
import {HTTP_STATUSES} from '../utils/constants'

const blogsExistsCheck = checkSchema({
  [POST_VALIDATION_FIELDS.ID]: {
    optional: true,
    in: 'params',
    custom: {
      options: async (blogId: string) => {
        const blog = await blogsQueryRepository.getBlogById(blogId)
        if (!blog) throw new Error(POST_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR)
      },
    },
  },
})

const blogExistsErrorSummary = async (
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

export const blogExistanceCheckMiddleware = [blogsExistsCheck, blogExistsErrorSummary]
