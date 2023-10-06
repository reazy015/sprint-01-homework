import {Request} from 'express'
import * as core from 'express-serve-static-core'

export interface CustomRequest<Body, URIParams = core.ParamsDictionary> extends Request<URIParams> {
  body: Body
}

export interface CustomQueryRequest<QueryParams> extends Request<{}, {}, {}, QueryParams> {}

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
  pageNumber: number
  pageSize: number
  sortBy: string
  sortDirection: 'asc' | 'desc'
  searchNameTerm: string
}
