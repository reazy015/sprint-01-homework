import {checkSchema} from 'express-validator'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

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
    custom: {
      options: async (login: string) => {
        const user = await usersQueryRepository.getUserByEmailOrLogin(login)

        if (user) {
          throw new Error('Login already in use')
        }
      },
      bail: true,
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
    custom: {
      options: async (email: string) => {
        const user = await usersQueryRepository.getUserByEmailOrLogin(email)

        if (user) {
          throw new Error('Email already in use')
        }
      },
      bail: true,
    },
  },
})
