export interface PostInputModel {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export interface Post extends PostInputModel {
  id: string
}

export interface PostViewModel extends Post {
  blogName: string
}
