import {Post, PostInputModel} from '../types/post'

type PostId = string
let postsDb: Record<PostId, Post> = {}

export const postsRepository = {
  getAllPosts() {
    return Object.values(postsDb)
  },
  getPostById(id: string) {
    return postsDb[id]
  },
  addPost(post: PostInputModel) {
    const id = +new Date()

    postsDb[id] = {
      ...post,
      id: id.toString(),
    }

    return id.toString()
  },
  updatePost(id: string, post: PostInputModel) {
    postsDb[id] = {
      id,
      ...post,
    }

    return true
  },
  deletePost(id: string) {
    delete postsDb[id]

    return true
  },
  deleteAllPosts() {
    postsDb = {}
  },
}
