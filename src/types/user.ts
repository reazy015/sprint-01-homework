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
export interface DbUser extends WithId<User> {
  salt: string
  hash: string
}
