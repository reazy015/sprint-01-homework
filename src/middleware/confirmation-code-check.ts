import {checkSchema} from 'express-validator'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

export const confirmationCodeCheck = checkSchema({
  code: {
    notEmpty: true,
    custom: {
      options: async (code: string) => {
        const confirmed = await usersQueryRepository.isConfirmedUserByCode(code)

        if (confirmed) {
          throw new Error('User already confirmed')
        } else {
          throw new Error('No such confirmation code')
        }
      },
    },
    errorMessage: 'Invalid confirmation code',
  },
})
