import express, {Request, Response} from 'express'
import {Blog, BlogInputModel} from '../types/blog'
import {blogsRepository} from '../data-access-layer/blogs-repository'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {postBlogValidateMiddleware} from '../middleware/blog-validate-middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'

export const getBlogsRouter = () => {
  const router = express.Router()

  router.get('/', (_, res: Response<Blog[]>) => {
    const blogs = blogsRepository.getAllBlogs()
    res.status(200).json(blogs)
  })

  router.post(
    '/',
    basicAuthMiddleware,
    postBlogValidateMiddleware(),
    validationErrorMiddleware,

    (req: Request<{}, {}, BlogInputModel>, res: Response<Blog | string>) => {
      const addBlogData = req.body

      const newBlogId = blogsRepository.addBlog(addBlogData)

      const newBlog = blogsRepository.getBlogById(newBlogId)

      if (!newBlog) {
        res.status(500).send('Error on creating')
        return
      }

      res.status(201).json(newBlog)
    },
  )

  return router
}
