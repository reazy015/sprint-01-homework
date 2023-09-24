import express, {Request, Response} from 'express'
import {BlogInputModel, BlogViewModel} from '../types/blog'
import {blogsRepository} from '../data-access-layer/blogs-repository'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {postBlogValidateMiddleware} from '../middleware/blog-validate-middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {CustomRequest, IdURIParam} from '../types/common'

export const getBlogsRouter = () => {
  const router = express.Router()

  router.get('/', (_, res: Response<BlogViewModel[]>) => {
    const blogs = blogsRepository.getAllBlogs()
    res.status(200).json(blogs)
  })

  router.get('/:id', (req: Request<IdURIParam>, res: Response<BlogViewModel>) => {
    const id = req.params.id

    const blog = blogsRepository.getBlogById(id)

    if (!blog) {
      res.sendStatus(404)
      return
    }

    res.status(200).send(blog)
  })

  router.post(
    '/',
    basicAuthMiddleware,
    postBlogValidateMiddleware(),
    validationErrorMiddleware,

    (req: CustomRequest<BlogInputModel>, res: Response<BlogViewModel>) => {
      const addBlogData = req.body

      const newBlogId = blogsRepository.addBlog(addBlogData)

      const newBlog = blogsRepository.getBlogById(newBlogId)

      if (!newBlog) {
        res.sendStatus(500)
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

    (req: CustomRequest<BlogInputModel, IdURIParam>, res: Response) => {
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

  router.delete('/:id', basicAuthMiddleware, (req: Request<IdURIParam>, res: Response) => {
    const id = req.params.id

    const blog = blogsRepository.getBlogById(id)

    if (!blog) {
      res.sendStatus(404)
      return
    }

    const deleteResult = blogsRepository.deleteBlogById(id)

    if (!deleteResult) {
      res.sendStatus(500)
      return
    }

    res.sendStatus(204)
  })

  return router
}
