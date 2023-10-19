import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {UserQueryParams, WithPaging} from '../../types/common'
import {DbInputNoneConfirmedUserModel, DbUser, UserViewModel} from '../../types/user'

const usersCollection = db.collection<DbUser>('users')
const noneConfirmedUsersCollection = db.collection<DbInputNoneConfirmedUserModel>('users')

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
}
