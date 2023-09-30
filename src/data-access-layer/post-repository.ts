import {UUID} from 'mongodb'
import {DbPost, PostInputModel} from '../types/post'
import {db} from './db'
import {Blog} from '../types/blog'

const postsCollection = db.collection<DbPost>('posts')
const blogsCollection = db.collection<Blog>('blogs')

export const postsRepository = {
  async getAllPosts() {
    const posts = await postsCollection.find({}, {projection: {_id: 0}}).toArray()
    return posts
  },
  async getPostById(id: string) {
    const post = await postsCollection.findOne({id}, {projection: {_id: 0}})

    return post ? post : null
  },
  async addPost(post: PostInputModel) {
    const id = new UUID(UUID.generate()).toString()
    const createdAt = new Date().toISOString()

    const blog = await blogsCollection.findOne({id: post.blogId})

    if (!blog) {
      return false
    }

    const postCreated = await db
      .collection<PostInputModel & {id: string; createdAt: string; blogName: string}>('posts')
      .insertOne({
        id,
        createdAt,
        blogName: blog.name,
        ...post,
      })

    if (!postCreated) {
      return false
    }

    return id
  },
  async updatePost(id: string, post: PostInputModel) {
    const blog = await blogsCollection.findOne({id: post.blogId})

    if (!blog) {
      return false
    }

    const postUpdated = await postsCollection.updateOne({id}, {$set: {...post}})

    if (!postUpdated) {
      return false
    }

    return true
  },
  async deletePost(id: string) {
    const postDeleted = await postsCollection.deleteOne({id})

    return Boolean(postDeleted)
  },
  async deleteAllPosts() {
    const allPostsDeleted = await postsCollection.deleteMany()

    return Boolean(allPostsDeleted)
  },
}
