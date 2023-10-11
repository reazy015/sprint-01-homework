import {checkSchema} from 'express-validator'

export const authCredentialsCheck = checkSchema({
  loginOrEmail: {
    isInt: {negated: true},
    isString: true,
    notEmpty: true,
    errorMessage: 'Can not be just int or empty',
  },
  password: {
    isInt: {negated: true},
    isString: true,
    notEmpty: true,
    errorMessage: 'Can not be just int or empty',
  },
})
