import {ObjectId} from 'mongodb'
import {BlogInputModel, DbBlog} from '../../types/blog'
import {db} from '../../db/db'
import {DbPost, PostInputModel, PostViewModel} from '../../types/post'

const blogsCollection = db.collection<DbBlog>('blogs')
const postsCollection = db.collection<Omit<DbPost, 'id'>>('posts')

export const blogsCommandRepository = {
  async addBlog(blog: BlogInputModel): Promise<string | false> {
    const createdAt = new Date().toISOString()
    const createdBlogs = await db
      .collection<BlogInputModel & {createdAt: string; isMembership: boolean}>('blogs')
      .insertOne({...blog, createdAt, isMembership: false})

    if (createdBlogs.acknowledged) {
      return createdBlogs.insertedId.toString()
    }

    return false
  },
  async addPostByBlogId(id: string, post: PostInputModel): Promise<PostViewModel | null> {
    const createdAt = new Date().toISOString()
    const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
    const newPost = {
      blogId: id,
      blogName: blog!.name,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      createdAt,
    }
    const createdPost = await postsCollection.insertOne({...newPost})

    return createdPost.acknowledged ? {id: createdPost.insertedId.toString(), ...newPost} : null
  },
  async updateBlog(id: string, blogUpdate: BlogInputModel): Promise<boolean> {
    const updatedBlog = await blogsCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: {...blogUpdate, isMembership: false}},
    )

    return updatedBlog.acknowledged
  },
  async deleteBlogById(id: string): Promise<boolean> {
    const deleted = await blogsCollection.deleteOne({_id: new ObjectId(id)})

    return deleted.acknowledged
  },
  async deleteAllBlogs(): Promise<boolean> {
    const deleted = await blogsCollection.deleteMany()

    return deleted.acknowledged
  },
}
