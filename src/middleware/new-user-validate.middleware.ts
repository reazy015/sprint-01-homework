import {checkSchema} from 'express-validator'

const LOGIN_REGEXP = /^[a-zA-Z0-9_-]*$/
export const EMAIL_REGEXP = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export const newUserValidateMiddleware = checkSchema({
  login: {
    isString: true,
    isInt: {negated: true},
    isLength: {
      options: {min: 3, max: 30},
    },
    matches: {
      options: LOGIN_REGEXP,
    },
  },
  password: {
    isString: true,
    isLength: {
      options: {min: 6, max: 20},
    },
  },
  email: {
    isString: true,
    matches: {
      options: EMAIL_REGEXP,
    },
  },
})
