import {Blog, BlogInputModel} from '../types/blog'

const blogsDb: Record<string, Blog> = {}

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
}
