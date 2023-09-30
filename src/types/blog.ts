export interface Blog {
  id: string
  name: string
  description: string
  websiteUrl: string
}

export interface BlogViewModel extends Blog {}

export interface BlogInputModel {
  name: string
  description: string
  websiteUrl: string
}
