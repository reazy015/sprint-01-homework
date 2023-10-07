import {checkSchema} from 'express-validator'
import {POST_ERROR_MESSAGES, POST_VALIDATION_FIELDS} from './constants'
import {blogsQueryRepository} from '../data-access-layer/query/blogs-query-repository'

export const postValidateMiddleware = checkSchema({
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
        const blog = await blogsQueryRepository.getBlogById(blogId)
        if (!blog) throw new Error(POST_ERROR_MESSAGES.BLOG_NOT_EXISTS_ERROR)
      },
    },
  },
})

export const queryPostValidateMiddleware = checkSchema(
  {
    [POST_VALIDATION_FIELDS.SORT_BY]: {
      optional: true,
      trim: true,
      notEmpty: true,
      isInt: {negated: true},
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.SORT_BY],
    },
    [POST_VALIDATION_FIELDS.SORT_DIRECTION]: {
      optional: true,
      trim: true,
      isString: true,
      notEmpty: true,
      isIn: {
        options: ['asc', 'desc'],
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.SORT_DIRECTION],
    },
    [POST_VALIDATION_FIELDS.PAGE_SIZE]: {
      optional: true,
      trim: true,
      isInt: true,
      notEmpty: true,
      isIn: {
        options: ['asc', 'desc'],
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.PAGE_SIZE],
    },
    [POST_VALIDATION_FIELDS.PAGE_NUMBER]: {
      optional: true,
      trim: true,
      isInt: true,
      notEmpty: true,
      isIn: {
        options: ['asc', 'desc'],
      },
      errorMessage: POST_ERROR_MESSAGES[POST_VALIDATION_FIELDS.PAGE_NUMBER],
    },
  },
  ['query'],
)

export const postByBlogValidateMiddleware = checkSchema({
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
})
