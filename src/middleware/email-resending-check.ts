import {checkSchema} from 'express-validator'
import {EMAIL_REGEXP} from './new-user-validate.middleware'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

export const emailResendingCheck = checkSchema({
  email: {
    matches: {
      options: EMAIL_REGEXP,
      errorMessage: 'Incorrect email',
    },
    custom: {
      options: async (email: string) => {
        const confirmed = await usersQueryRepository.isConfirmedUser(email)

        if (confirmed) {
          throw new Error('User already confirmed')
        }

        const user = await usersQueryRepository.getUserConfirmationCodeByEmail(email)

        if (!user) {
          throw new Error('No such email')
        }
      },
    },
  },
})
