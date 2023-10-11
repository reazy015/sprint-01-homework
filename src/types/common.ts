import {Request} from 'express'
import * as core from 'express-serve-static-core'

export interface CustomRequest<Body, URIParams = core.ParamsDictionary> extends Request<URIParams> {
  body: Body
}

export interface CustomQueryRequest<QueryParams = core.Query, URIParams = core.ParamsDictionary>
  extends Request<URIParams, {}, {}, QueryParams> {}

export type IdURIParam = {
  id: string
}

export interface WithPaging<T> {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: T[]
}

export interface BlogQueryParams {
  pageNumber: string
  pageSize: string
  sortBy: string
  sortDirection: 'asc' | 'desc'
  searchNameTerm: string
}

export interface PostQueryParams extends Omit<BlogQueryParams, 'searchNameTerm'> {}
// export interface UserQueryParams extends Omit<BlogQueryParams, 'searchNameTerm'> {
//   searchLoginTerm: string
//   searchEmailTerm: string
// }
// export type UserQueryParams = {
//   pageNumber: string
//   pageSize: string
//   sortBy: string
//   sortDirection: 'asc' | 'desc'
//   searchNameTerm: string
//   searchLoginTerm: string
//   searchEmailTerm: string
// }

export type UserQueryParams = {
  pageNumber: string
  pageSize: string
  sortBy: string
  sortDirection: 'asc' | 'desc'
  searchNameTerm: string
  searchLoginTerm: string
  searchEmailTerm: string
}

export type NewUserCredentials = {
  login: string
  password: string
  email: string
}
