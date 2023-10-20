import {checkSchema} from 'express-validator'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

export const confirmationCodeCheck = checkSchema({
  code: {
    notEmpty: true,
    custom: {
      options: async (code: string) => {
        const codeExists = await usersQueryRepository.confirmationCodeExistsCheck(code)

        if (!codeExists) {
          throw new Error('No such confirmation code')
        }

        const confirmed = await usersQueryRepository.isConfirmedUserByCode(code)

        if (confirmed) {
          throw new Error('User already confirmed')
        }
      },
    },
    errorMessage: 'Invalid confirmation code',
  },
})
