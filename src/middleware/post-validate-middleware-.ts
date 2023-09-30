import {checkSchema} from 'express-validator'
import {POST_ERROR_MESSAGES, POST_VALIDATION_FIELDS} from './constants'
import {blogsRepository} from '../data-access-layer/blogs-repository'

export const postValidateMiddleware = () =>
  checkSchema({
    [POST_VALIDATION_FIELDS.TITLE]: {
      trim: true,
      isString: true,
      isLength: {
        options: {min: 3, max: 30},
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.TITLE],
    },
    [POST_VALIDATION_FIELDS.CONTENT]: {
      trim: true,
      isString: true,
      isLength: {
        options: {min: 3, max: 1000},
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.CONTENT],
    },
    [POST_VALIDATION_FIELDS.SHORT_DESCRIPTION]: {
      trim: true,
      isString: true,
      isLength: {
        options: {min: 3, max: 100},
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.SHORT_DESCRIPTION],
    },
    [POST_VALIDATION_FIELDS.BLOG_ID]: {
      custom: {
        options: async (blogId: string) => {
          const blog = await blogsRepository.getBlogById(blogId)
          if (!blog) throw new Error(POST_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR)
        },
      },
    },
  })
