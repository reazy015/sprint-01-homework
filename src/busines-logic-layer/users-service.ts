import {usersCommandRepository} from '../data-access-layer/command/users-command-repository'
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
  async _getHash(password: string): Promise<{salt: string; hash: string}> {
    const salt = crypto.randomBytes(10).toString('base64')
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
