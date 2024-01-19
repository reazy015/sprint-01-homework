import {WithId} from 'mongodb'

interface User {
  login: string
  email: string
  createdAt: string
}

export interface UserViewModel extends User {
  id: string
}

export interface DbInputUser extends User {
  salt: string
  hash: string
}

export interface InputUserModel extends User {}

export interface InputNoneConfirmedUserModel extends User {
  confirmationCode: string | null
  confirmationSentDate: string
  expiresIn: string | null
  confirmed: boolean
}

export interface DbInputNoneConfirmedUserModel extends InputNoneConfirmedUserModel {
  hash: string
  salt: string
}

export interface DbUser extends WithId<User> {
  salt: string
  hash: string
}

export interface UserJWTPayload {
  login: string
  email: string
  id: string
  createdAt: string
}

export interface DeviceAuthSession {
  iat: number
  exp: number
  userId: string
  ip: string
  title: string
  lastActiveDate: string
  deviceId: string
}
