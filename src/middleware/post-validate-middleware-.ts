import {checkSchema} from 'express-validator'
import {POST_ERROR_MESSAGES, POST_VALIDATION_FIELDS} from './constants'
import {blogsRepository} from '../data-access-layer/blogs-repository'

export const postValidateMiddleware = () =>
  checkSchema({
    [POST_VALIDATION_FIELDS.TITLE]: {
      isLength: {
        options: {min: 3, max: 30},
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.TITLE],
    },
    [POST_VALIDATION_FIELDS.CONTENT]: {
      isLength: {
        options: {min: 3, max: 1000},
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.CONTENT],
    },
    [POST_VALIDATION_FIELDS.SHORT_DESCRIPTION]: {
      isLength: {
        options: {min: 3, max: 100},
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.SHORT_DESCRIPTION],
    },
    [POST_VALIDATION_FIELDS.BLOG_ID]: {
      custom: {
        options: (blogId: string) => {
          const blog = blogsRepository.getBlogById(blogId)
          return Boolean(blog)
        },
      },
      errorMessage: POST_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR,
    },
  })
