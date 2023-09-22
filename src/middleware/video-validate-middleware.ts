import {checkSchema, param} from 'express-validator'
import {RESOLUTIONS} from '../utils/constants'
import {ERROR_MESSAGES} from './constants'

export const getVideoByIdMiddleware = () =>
  param('id').notEmpty().isNumeric().withMessage(ERROR_MESSAGES.id)
export const postVideoMiddleware = () =>
  checkSchema({
    title: {
      isLength: {
        options: {min: 3, max: 40},
        errorMessage: ERROR_MESSAGES.TITLE,
      },
    },
    author: {
      isLength: {
        options: {min: 3, max: 20},
        errorMessage: ERROR_MESSAGES.AUTHOR,
      },
    },
    availableResolutions: {
      isArray: {options: {min: 1}},
      isIn: {
        options: [RESOLUTIONS],
      },
      errorMessage: ERROR_MESSAGES.AVAILABLE_RESOLUTIONS,
    },
  })
export const putVideoMiddleware = () => {
  return checkSchema(
    {
      title: {
        isLength: {
          options: {min: 3, max: 40},
          errorMessage: ERROR_MESSAGES.title,
        },
      },
      author: {
        isLength: {
          options: {min: 3, max: 20},
          errorMessage: ERROR_MESSAGES.author,
        },
      },
      availableResolutions: {
        isArray: {options: {min: 1}},
        isIn: {
          options: [RESOLUTIONS],
        },
        errorMessage: ERROR_MESSAGES.availableResolutions,
      },
      canBeDownloaded: {
        isBoolean: {
          options: {strict: true},
        },
        errorMessage: ERROR_MESSAGES.canBeDownloaded,
      },
      minAgeRestriction: {
        optional: true,
        isInt: {
          options: {min: 1, max: 18},
        },
        errorMessage: ERROR_MESSAGES.minAgeRestriction,
      },
      publicationDate: {
        isString: true,
        errorMessage: ERROR_MESSAGES.publicationDate,
      },
    },
    ['body'],
  )
}
