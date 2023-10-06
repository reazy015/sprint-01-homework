import {WithId} from 'mongodb'

export interface Blog {
  id: string
  name: string
  description: string
  websiteUrl: string
  isMembership: boolean
  createdAt: string
}

export interface BlogViewModel extends Blog {}

export interface DbBlog extends WithId<Blog> {}

export interface BlogInputModel {
  name: string
  description: string
  websiteUrl: string
}
