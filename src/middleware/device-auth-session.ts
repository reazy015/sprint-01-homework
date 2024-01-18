import {Request, Response, NextFunction} from 'express'
import {HTTP_STATUSES} from '../utils/constants'
import {SETTINGS} from '../shared/configs'
import {UserViewModel} from '../types/user'
import jwt from 'jsonwebtoken'
import {usersQueryRepository} from '../repositories/query/users-query-repository'

// [
//   {
//     "ip": "string",
//     "title": "string",
//     "lastActiveDate": "string",
//     "deviceId": "string"
//   }
// ]
export const deviceAuthSession = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers['user-agent'])
  console.log(req.ip)
  next()
}
