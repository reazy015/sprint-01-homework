import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {UserQueryParams, WithPaging} from '../../types/common'
import {DbUser, UserViewModel} from '../../types/user'

const usersCollection = db.collection<DbUser>('users')

export const usersQueryRepository = {
  async getUsers(queryParams: UserQueryParams): Promise<WithPaging<UserViewModel>> {
    const {pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm} =
      queryParams
    const sort = sortDirection === 'asc' ? 1 : -1
    const filter = {
      $or: [{login: {$regex: searchLoginTerm}}, {email: {$regex: searchEmailTerm}}],
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
}
