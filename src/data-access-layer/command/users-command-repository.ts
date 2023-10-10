import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {DbInputUser, DbUser, InputUserModel} from '../../types/user'

const usersCollection = db.collection<DbInputUser>('users')

export const usersCommandRepository = {
  async createUser(user: InputUserModel, salt: string, hash: string): Promise<string | null> {
    const createdUser = await usersCollection.insertOne({
      login: user.login,
      email: user.email,
      salt: salt,
      hash: hash,
      createdAt: user.createdAt,
    })

    return createdUser.acknowledged ? createdUser.insertedId.toString() : null
  },
  async deleteUserById(id: string): Promise<boolean> {
    const deleted = await db.collection<DbUser>('users').deleteOne({_id: new ObjectId(id)})

    return deleted.acknowledged
  },
  async deleteAllUsers(): Promise<boolean> {
    const deleted = await db.collection<DbUser>('users').deleteMany()

    return deleted.acknowledged
  },
}
