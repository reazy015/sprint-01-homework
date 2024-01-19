import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {
  DeviceAuthSession,
  DbInputNoneConfirmedUserModel,
  DbInputUser,
  DbUser,
  InputUserModel,
} from '../../types/user'

const usersCollection = db.collection<DbInputUser>('users')
const noneConfirmedUsersCollection = db.collection<DbInputNoneConfirmedUserModel>('users')
const refreshTokenBlackListCollection = db.collection<{refreshToken: string}>(
  'refresh-token-black-list',
)
const deviceAuthSessionsCollection = db.collection<DeviceAuthSession>('device-auth-sessions')

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
  async createNoneConfirmedUser(user: DbInputNoneConfirmedUserModel): Promise<boolean> {
    const createdUser = await noneConfirmedUsersCollection.insertOne(user)

    return createdUser.acknowledged
  },
  async verifyAndConfirmUser(code: string): Promise<boolean> {
    const user = await noneConfirmedUsersCollection.findOne({confirmationCode: code})

    if (!user) {
      return false
    }

    if (user.confirmationCode !== code) {
      return false
    }

    const updateConfirmedStatus = await noneConfirmedUsersCollection.updateOne(
      {_id: user._id},
      {$set: {confirmationCode: null, expiresIn: null, confirmed: true}},
    )

    return updateConfirmedStatus.acknowledged
  },
  async deleteUserById(id: string): Promise<boolean> {
    const deleted = await db.collection<DbUser>('users').deleteOne({_id: new ObjectId(id)})

    return deleted.acknowledged
  },
  async deleteNoneConfirmedUserByConfirmationCode(code: string): Promise<boolean> {
    const deleted = await noneConfirmedUsersCollection.deleteOne({confirmationCode: code})

    return deleted.acknowledged
  },
  async deleteAllUsers(): Promise<boolean> {
    const deleted = await db.collection<DbUser>('users').deleteMany()

    return deleted.acknowledged
  },
  async deleteAllDeviceAuthSessions(): Promise<boolean> {
    const deleted = await deviceAuthSessionsCollection.deleteMany()

    return deleted.acknowledged
  },
  async updateUserConfirmationCodeByEmail(
    email: string,
    confirmationCode: string,
  ): Promise<boolean> {
    await noneConfirmedUsersCollection.updateOne({email}, {$set: {confirmationCode}})

    return true
  },
  async addRefreshTokenToBlackList(refreshToken: string): Promise<boolean> {
    const addToBlackList = await refreshTokenBlackListCollection.insertOne({refreshToken})

    return addToBlackList.acknowledged
  },
  async addDeviceAuthSession(
    iat: number,
    exp: number,
    userId: string,
    ip: string,
    title: string,
    deviceId: string,
  ): Promise<boolean> {
    const lastActiveDate = new Date().toISOString()

    const addToDeviceAuthSessions = await deviceAuthSessionsCollection.insertOne({
      iat,
      exp,
      userId,
      ip,
      title,
      lastActiveDate,
      deviceId,
    })

    return addToDeviceAuthSessions.acknowledged
  },
  async updateDeviceAuthSession(tokenIat: number, newTokenIat: number): Promise<boolean> {
    const lastActiveDate = new Date().toISOString()

    const deviceAuthSessionUpdated = await deviceAuthSessionsCollection.findOneAndUpdate(
      {
        iat: tokenIat,
      },
      {$set: {iat: newTokenIat, lastActiveDate}},
      {returnDocument: 'after'},
    )

    return Boolean(deviceAuthSessionUpdated)
  },
}
