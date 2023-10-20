import {db} from '../../db/db'
import {DbInputNoneConfirmedUserModel, InputNoneConfirmedUserModel} from '../../types/user'

const noneConfirmedUsersCollection = db.collection<DbInputNoneConfirmedUserModel>('users')

export const authQueryRepository = {
  async getNoneConfirmedUserByEmailOrLogin({
    email,
    login,
  }: {
    email: string
    login: string
  }): Promise<InputNoneConfirmedUserModel | null> {
    const user = await noneConfirmedUsersCollection.findOne({$or: [{login}, {email}]})

    if (!user) {
      return null
    }

    return user
  },
}
