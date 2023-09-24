import {BlogViewModel, BlogInputModel} from '../types/blog'

type BlogId = string
let blogsDb: Record<BlogId, BlogViewModel> = {}

export const blogsRepository = {
  getAllBlogs() {
    return Object.values(blogsDb)
  },
  getBlogById(id: string) {
    if (id in blogsDb) {
      return blogsDb[id]
    }

    return null
  },
  addBlog(blog: BlogInputModel) {
    const id = +new Date()
    blogsDb[id] = {
      id: id.toString(),
      ...blog,
    }

    return id.toString()
  },
  updateBlog(id: string, blogUpdate: BlogInputModel) {
    blogsDb[id] = {
      id,
      ...blogUpdate,
    }

    return true
  },
  deleteBlogById(id: string) {
    delete blogsDb[id]

    return true
  },
  deleteAllBlogs() {
    blogsDb = {}
  },
}
