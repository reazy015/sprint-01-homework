import {usersCommandRepository} from '../data-access-layer/command/users-command-repository'
import {usersQueryRepository} from '../data-access-layer/query/users-query-repository'
import {AuthLoginInput} from '../types/auth'
import {NewUserCredentials} from '../types/common'
import crypto from 'crypto'

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

    const result = await this._getHash(password, saltAndHash.salt)

    return result.hash === saltAndHash.hash
  },
  async _getHash(password: string, usersSalt?: string): Promise<{salt: string; hash: string}> {
    const salt = usersSalt ?? crypto.randomBytes(10).toString('base64')
    const interations = 10000

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, interations, 64, 'sha512', (error, hash) => {
        if (error) {
          reject(error)
        }

        resolve({
          salt,
          hash: hash.toString('base64'),
        })
      })
    })
  },
}
