import {usersCommandRepository} from '../data-access-layer/command/users-command-repository'
import {usersQueryRepository} from '../data-access-layer/query/users-query-repository'
import {AuthLoginInput} from '../types/auth'
import {NewUserCredentials} from '../types/common'
import bcrypt from 'bcrypt'

export const usersService = {
  async addNewUser(newUser: NewUserCredentials): Promise<string | null> {
    const {password} = newUser
    const {salt, hash} = await this._getHash(password)
    const createdAt = new Date().toISOString()

    const newUserId = await usersCommandRepository.createUser({...newUser, createdAt}, salt, hash)

    return newUserId
  },
  async checkUserRegistered({loginOrEmail, password}: AuthLoginInput): Promise<boolean> {
    const saltAndHash = await usersQueryRepository.getUserHashAndSaltByEmailOrLogin(loginOrEmail)

    if (!saltAndHash) return false

    const result = await bcrypt.compare(password, saltAndHash.hash)

    return result
  },
  async _getHash(password: string, userSalt?: string): Promise<{salt: string; hash: string}> {
    const roundsNumber = 10
    const salt = userSalt ?? (await bcrypt.genSalt(roundsNumber))

    const hash = await bcrypt.hash(password, roundsNumber)

    return {
      salt,
      hash,
    }
  },
}
