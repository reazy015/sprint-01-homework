const authDb: Record<string, {login: string; password: string}> = {
  admin: {
    login: 'admin',
    password: 'qwerty',
  },
}

export const authRepository = {
  isValidBasicAuth(basicAuthString: string) {
    const string = basicAuthString?.split(' ')[1]
    const decodedString = Buffer.from(string as string, 'base64').toString('ascii')
    const [login, password] = decodedString.split(':')

    if (login in authDb && password === authDb[login].password) {
      return true
    }

    return false
  },
}
