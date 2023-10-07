import {param} from 'express-validator'
import {ObjectId} from 'mongodb'
import {COMMON_ERROR_MESSAGE} from './constants'

export const validIdCheckMiddleware = () =>
  param('id')
    .custom((id) => ObjectId.isValid(id))
    .withMessage(COMMON_ERROR_MESSAGE.INVALID_ID)
