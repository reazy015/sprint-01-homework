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

  router.get('/:id', (req: Request<{id: string}>, res: Response<Blog | string>) => {
    const id = req.params.id

    const blog = blogsRepository.getBlogById(id)

    if (!blog) {
      res.status(404).send('Not found')
      return
    }

    res.status(200).send(blog)
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

  router.put(
    '/:id',
    basicAuthMiddleware,
    postBlogValidateMiddleware(),
    validationErrorMiddleware,

    (req: Request<{id: string}, {}, BlogInputModel>, res: Response) => {
      const id = req.params.id

      const blog = blogsRepository.getBlogById(id)

      if (!blog) {
        res.sendStatus(404)
        return
      }

      const updateResult = blogsRepository.updateBlog(id, req.body)

      if (!updateResult) {
        res.sendStatus(500)
        return
      }

      res.sendStatus(204)
    },
  )

  return router
}
