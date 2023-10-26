import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {SETTINGS} from '../shared/configs'
import crypto from 'crypto'

const TOKEN_EXPIRES_IN = '10s'

export const cryptoService = {
  getJWTToken<T extends string | object | Buffer>(payload: T, expiresIn?: string): string | null {
    let token: string

    try {
      token = jwt.sign(payload, SETTINGS.SECRET_KEY, {expiresIn: expiresIn || TOKEN_EXPIRES_IN})
    } catch (error) {
      console.log(error)

      throw new Error('JWT token creating error')
    }

    if (!token) {
      return null
    }

    return token
  },
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  },
  async getHash(password: string, userSalt?: string): Promise<{salt: string; hash: string}> {
    const roundsNumber = 10
    const salt = userSalt ?? (await bcrypt.genSalt(roundsNumber))

    const hash = await bcrypt.hash(password, roundsNumber)

    return {
      salt,
      hash,
    }
  },
  getConfirmationCode(): string {
    return crypto.randomUUID()
  },
}
