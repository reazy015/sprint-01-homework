import {UUID} from 'mongodb'
import {BlogInputModel, Blog} from '../types/blog'
import {db} from './db'

const blogsCollection = db.collection<Blog>('blogs')

export const blogsRepository = {
  async getAllBlogs() {
    const blogs = await blogsCollection.find({}, {projection: {_id: 0}}).toArray()

    return blogs
  },
  async getBlogById(id: string) {
    const blog = await blogsCollection.findOne({id}, {projection: {_id: 0}})

    if (blog) {
      return blog
    }

    return null
  },
  async addBlog(blog: BlogInputModel) {
    const id = new UUID(UUID.generate()).toString()
    const createdAt = new Date().toISOString()
    const created = await db
      .collection<BlogInputModel & {id: string; createdAt: string; isMembership: boolean}>('blogs')
      .insertOne({id, createdAt, isMembership: false, ...blog})

    if (created) {
      return id
    }

    return false
  },
  async updateBlog(id: string, blogUpdate: BlogInputModel) {
    const updated = await blogsCollection.updateOne(
      {id},
      {$set: {...blogUpdate, isMembership: false}},
    )

    return Boolean(updated)
  },
  async deleteBlogById(id: string) {
    const deleted = await blogsCollection.deleteOne({id})

    return Boolean(deleted)
  },
  async deleteAllBlogs() {
    const deleted = await blogsCollection.deleteMany()

    return Boolean(deleted)
  },
}
