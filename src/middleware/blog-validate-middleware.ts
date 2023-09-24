import {checkSchema} from 'express-validator'
import {BLOG_ERROR_MESSAGES} from './constants'

export const postBlogValidateMiddleware = () =>
  checkSchema({
    name: {
      trim: true,
      isString: true,
      isLength: {
        options: {max: 15, min: 3},
      },
      errorMessage: BLOG_ERROR_MESSAGES.name,
    },
    description: {
      trim: true,
      isString: true,
      isLength: {
        options: {max: 500},
      },
      errorMessage: BLOG_ERROR_MESSAGES.description,
    },
    websiteUrl: {
      trim: true,
      isString: true,
      isLength: {
        options: {max: 100},
      },
      matches: {
        options: new RegExp('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$'),
      },
      errorMessage: BLOG_ERROR_MESSAGES.websiteUrl,
    },
  })
