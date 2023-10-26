import {checkSchema} from 'express-validator'
import {BLOG_ERROR_MESSAGES, BLOG_VALIDATION_FIELDS} from './constants'

const WEBSITE_URL_REGEXP = new RegExp(
  '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
)
export const postBlogValidateMiddleware = checkSchema({
  [BLOG_VALIDATION_FIELDS.NAME]: {
    trim: true,
    isString: true,
    isLength: {
      options: {max: 15, min: 3},
    },
    errorMessage: BLOG_ERROR_MESSAGES[BLOG_VALIDATION_FIELDS.NAME],
  },
  [BLOG_VALIDATION_FIELDS.DESCRIPTION]: {
    trim: true,
    isString: true,
    isLength: {
      options: {max: 500},
    },
    errorMessage: BLOG_ERROR_MESSAGES[BLOG_VALIDATION_FIELDS.DESCRIPTION],
  },
  [BLOG_VALIDATION_FIELDS.WEBSITE_URL]: {
    trim: true,
    isString: true,
    isLength: {
      options: {max: 100},
    },
    matches: {
      options: WEBSITE_URL_REGEXP,
    },
    errorMessage: BLOG_ERROR_MESSAGES[BLOG_VALIDATION_FIELDS.WEBSITE_URL],
  },
})

export const queryBlogValidateMiddleware = checkSchema(
  {
    [BLOG_VALIDATION_FIELDS.SORT_BY]: {
      optional: true,
      trim: true,
      notEmpty: true,
      isInt: {negated: true},
      errorMessage: BLOG_ERROR_MESSAGES[BLOG_VALIDATION_FIELDS.SORT_BY],
    },
    [BLOG_VALIDATION_FIELDS.SORT_DIRECTION]: {
      optional: true,
      trim: true,
      isString: true,
      notEmpty: true,
      isIn: {
        options: ['asc', 'desc'],
      },
      errorMessage: BLOG_ERROR_MESSAGES[BLOG_VALIDATION_FIELDS.SORT_DIRECTION],
    },
    [BLOG_VALIDATION_FIELDS.PAGE_SIZE]: {
      optional: true,
      trim: true,
      isInt: true,
      notEmpty: true,
      isIn: {
        options: ['asc', 'desc'],
      },
      errorMessage: BLOG_ERROR_MESSAGES[BLOG_VALIDATION_FIELDS.PAGE_SIZE],
    },
    [BLOG_VALIDATION_FIELDS.PAGE_NUMBER]: {
      optional: true,
      trim: true,
      isInt: true,
      notEmpty: true,
      isIn: {
        options: ['asc', 'desc'],
      },
      errorMessage: BLOG_ERROR_MESSAGES[BLOG_VALIDATION_FIELDS.PAGE_NUMBER],
    },
  },
  ['query'],
)
