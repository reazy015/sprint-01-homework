import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {UserQueryParams, WithPaging} from '../../types/common'
import {
  DeviceAuthSession,
  DbInputNoneConfirmedUserModel,
  DbUser,
  UserViewModel,
} from '../../types/user'

const usersCollection = db.collection<DbUser>('users')
const noneConfirmedUsersCollection = db.collection<DbInputNoneConfirmedUserModel>('users')
const refreshTokenBlackListCollection = db.collection<{refreshToken: string}>(
  'refresh-token-black-list',
)
const deviceAuthSessionsCollection = db.collection<DeviceAuthSession>('device-auth-sessions')

export const usersQueryRepository = {
  async getUsers(queryParams: UserQueryParams): Promise<WithPaging<UserViewModel>> {
    const {pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm} =
      queryParams
    const sort = sortDirection === 'asc' ? 1 : -1
    const filter = {
      $or: [
        {login: {$regex: searchLoginTerm, $options: 'i'}},
        {email: {$regex: searchEmailTerm, $options: 'i'}},
      ],
    }

    const totalUsersCount = await usersCollection.countDocuments(filter)

    const users = await usersCollection
      .find(filter)
      .sort({[sortBy]: sort})
      .skip(+pageSize * (+pageNumber - 1))
      .limit(+pageSize)
      .toArray()

    return {
      totalCount: totalUsersCount,
      pagesCount: Math.ceil(totalUsersCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      items: users.map<UserViewModel>((user) => ({
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      })),
    }
  },
  async getSingleUserById(id: string): Promise<UserViewModel | null> {
    const user = await usersCollection.findOne({_id: new ObjectId(id)})

    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    }
  },
  async getUserHashAndSaltByEmailOrLogin(
    emailOrLogin: string,
  ): Promise<{salt: string; hash: string} | null> {
    const user = await usersCollection.findOne({
      $or: [{login: emailOrLogin}, {email: emailOrLogin}],
    })

    if (!user) {
      return null
    }

    return {
      salt: user.salt,
      hash: user.hash,
    }
  },
  async getUserByEmailOrLogin(
    emailOrLogin: string,
  ): Promise<(UserViewModel & {hash: string}) | null> {
    const user = await usersCollection.findOne({
      $or: [{login: emailOrLogin}, {email: emailOrLogin}],
    })

    if (!user) return null

    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      hash: user.hash,
    }
  },
  async getUserConfirmationCodeByEmail(email: string): Promise<string | null> {
    const user = await noneConfirmedUsersCollection.findOne({email})

    if (!user) {
      return null
    }

    return user.confirmationCode
  },
  async isConfirmedUser(email: string): Promise<boolean> {
    const user = await noneConfirmedUsersCollection.findOne({email})

    return user ? user.confirmed : false
  },
  async isConfirmedUserByCode(confirmationCode: string): Promise<boolean> {
    const user = await noneConfirmedUsersCollection.findOne({confirmationCode})

    return user ? user.confirmed : false
  },
  async confirmationCodeExistsCheck(confirmationCode: string): Promise<boolean> {
    const found = await noneConfirmedUsersCollection.findOne({confirmationCode})

    return found ? true : false
  },
  async refreshTokenBlackListCheck(refreshToken: string): Promise<boolean> {
    const inBlackList = await refreshTokenBlackListCollection.findOne({refreshToken})

    return Boolean(inBlackList)
  },
  async getUserDeviceAuthSessions(
    userId: string,
  ): Promise<Omit<DeviceAuthSession, 'iat' | 'exp' | 'userId'>[]> {
    const deviceAuthSessions = await deviceAuthSessionsCollection.find({userId}).toArray()

    return deviceAuthSessions.map((session) => ({
      deviceId: session.deviceId,
      lastActiveDate: session.lastActiveDate,
      title: session.title,
      ip: session.ip,
    }))
  },
  async getDeviceAuthSessionUserId(deviceId: string): Promise<string | null> {
    const deviceAuthSession = await deviceAuthSessionsCollection.findOne({deviceId})

    if (!deviceAuthSession) {
      return null
    }

    return deviceAuthSession.userId
  },
  async getSingleDeviceAuthSession(
    deviceId: string,
  ): Promise<Omit<DeviceAuthSession, 'iat' | 'exp' | 'userId'> | null> {
    const deviceAuthSession = await deviceAuthSessionsCollection.findOne({deviceId})

    if (!deviceAuthSession) {
      return null
    }

    return {
      deviceId: deviceAuthSession.deviceId,
      ip: deviceAuthSession.ip,
      title: deviceAuthSession.title,
      lastActiveDate: deviceAuthSession.lastActiveDate,
    }
  },
  async deleteAllDeviceAuthSessionsExceptCurrent(
    tokenIat: number,
    userId: string,
  ): Promise<boolean> {
    const deviceAuthSessionsDeleted = await deviceAuthSessionsCollection.deleteMany({
      iat: {$ne: tokenIat},
      userId: {$ne: userId},
    })

    return deviceAuthSessionsDeleted.acknowledged
  },
  async deleteSingleDeviceAuthSessionByDeviceId(deviceId: string): Promise<boolean> {
    const deviceAuthSessionsDeleted = await deviceAuthSessionsCollection.deleteOne({
      deviceId,
    })

    return deviceAuthSessionsDeleted.acknowledged
  },
  async deleteSingleDeviceAuthSessionByRefreshTokenIat(iat: number): Promise<boolean> {
    const deviceAuthSessionsDeleted = await deviceAuthSessionsCollection.deleteOne({
      iat,
    })

    return deviceAuthSessionsDeleted.acknowledged
  },
  async deleteBlackListRecords(): Promise<boolean> {
    return (await refreshTokenBlackListCollection.deleteMany()).acknowledged
  },
}
