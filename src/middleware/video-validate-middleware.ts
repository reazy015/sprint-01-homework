import {checkSchema, param} from 'express-validator'
import {RESOLUTIONS} from '../utils/constants'
import {ERROR_MESSAGES, VIDEO_VALIDATION_FIELDS} from './constants'

export const getVideoByIdMiddleware = () =>
  param('id').notEmpty().isNumeric().withMessage(ERROR_MESSAGES.id)
export const postVideoMiddleware = () =>
  checkSchema({
    [VIDEO_VALIDATION_FIELDS.TITLE]: {
      isLength: {
        options: {min: 3, max: 40},
        errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.TITLE],
      },
    },
    [VIDEO_VALIDATION_FIELDS.AUTHOR]: {
      isLength: {
        options: {min: 3, max: 20},
        errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.AUTHOR],
      },
    },
    [VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS]: {
      isArray: {options: {min: 1}},
      isIn: {
        options: [RESOLUTIONS],
      },
      errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS],
    },
  })
export const putVideoMiddleware = () => {
  return checkSchema({
    [VIDEO_VALIDATION_FIELDS.TITLE]: {
      isLength: {
        options: {min: 3, max: 40},
        errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.TITLE],
      },
    },
    [VIDEO_VALIDATION_FIELDS.AUTHOR]: {
      isLength: {
        options: {min: 3, max: 20},
        errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.AUTHOR],
      },
    },
    [VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS]: {
      isArray: {options: {min: 1}},
      isIn: {
        options: [RESOLUTIONS],
      },
      errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.AVAILABLE_RESOLUTIONS],
    },
    [VIDEO_VALIDATION_FIELDS.CAN_BE_DOWNLOADED]: {
      isBoolean: {
        options: {strict: true},
      },
      errorMessage: ERROR_MESSAGES.canBeDownloaded,
    },
    [VIDEO_VALIDATION_FIELDS.MIN_AGE_RESTRICTION]: {
      optional: true,
      isInt: {
        options: {min: 1, max: 18},
      },
      errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.MIN_AGE_RESTRICTION],
    },
    [VIDEO_VALIDATION_FIELDS.PUBLICATION_DATE]: {
      isString: true,
      errorMessage: ERROR_MESSAGES[VIDEO_VALIDATION_FIELDS.PUBLICATION_DATE],
    },
  })
}
