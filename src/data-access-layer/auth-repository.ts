import {db} from '../db/db'

interface AuthCredentials {
  login: string
  password: string
}

const authCollection = db.collection<AuthCredentials>('credentials')

export const authRepository = {
  async isValidBasicAuth(basicAuthString: string) {
    const [authType, string] = basicAuthString?.split(' ')

    if (authType !== 'Basic') {
      return false
    }

    const decodedString = Buffer.from(string as string, 'base64').toString('ascii')
    const [login, password] = decodedString.split(':')

    const hasRegistered = await authCollection.findOne({login, password}, {projection: {_id: 0}})

    if (hasRegistered) {
      return true
    }

    return false
  },
}
