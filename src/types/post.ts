export interface PostInputModel {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export interface Post extends PostInputModel {
  id: string
  createdAt: string
}

export interface PostViewModel extends Post {
  blogName: string
}

export interface DbPost extends PostViewModel {}
