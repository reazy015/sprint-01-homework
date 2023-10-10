import {db} from '../db/db'
import {NewUserCredentials} from '../types/common'
import {DbInputUser, UserViewModel} from '../types/user'
import crypto from 'crypto'

const usersCollection = db.collection<DbInputUser>('users')

export const usersService = {
  async addNewUser(newUser: NewUserCredentials): Promise<string | null> {
    const {password, login, email} = newUser
    const {salt, hash} = await this._getHash(password)
    const createdAt = new Date().toISOString()

    const createdUser = await usersCollection.insertOne({
      login: login,
      email: email,
      salt: salt,
      hash: hash,
      createdAt: createdAt,
    })

    return createdUser.acknowledged ? createdUser.insertedId.toString() : null
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
