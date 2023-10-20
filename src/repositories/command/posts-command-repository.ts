import {ObjectId} from 'mongodb'
import {DbPost, PostInputModel} from '../../types/post'
import {db} from '../../db/db'
import {DbBlog} from '../../types/blog'

const postsCollection = db.collection<DbPost>('posts')
const blogsCollection = db.collection<DbBlog>('blogs')

export const postsCommandRepository = {
  async addPost(post: PostInputModel): Promise<string | false> {
    const createdAt = new Date().toISOString()

    const blog = await blogsCollection.findOne({_id: new ObjectId(post.blogId)})

    if (!blog) {
      return false
    }

    const newPost: PostInputModel & {
      createdAt: string
      blogName: string
    } = {
      ...post,
      createdAt,
      blogName: blog.name,
      blogId: blog._id.toString(),
    }

    const postCreated = await db
      .collection<
        PostInputModel & {
          createdAt: string
          blogName: string
        }
      >('posts')
      .insertOne({...newPost})

    return postCreated.acknowledged ? postCreated.insertedId.toString() : false
  },
  async updatePost(id: string, post: PostInputModel): Promise<boolean> {
    const postUpdated = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: {...post}})

    return postUpdated.acknowledged
  },
  async deletePost(id: string) {
    const postDeleted = await postsCollection.deleteOne({_id: new ObjectId(id)})

    return postDeleted.acknowledged
  },
  async deleteAllPosts() {
    const allPostsDeleted = await postsCollection.deleteMany()

    return allPostsDeleted.acknowledged
  },
}
