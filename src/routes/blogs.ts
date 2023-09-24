import express, {Request, Response} from 'express'
import {BlogInputModel, BlogViewModel} from '../types/blog'
import {blogsRepository} from '../data-access-layer/blogs-repository'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {postBlogValidateMiddleware} from '../middleware/blog-validate-middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {CustomRequest, IdURIParam} from '../types/common'
import {HTTP_STATUSES} from '../utils/constants'

export const getBlogsRouter = () => {
  const router = express.Router()

  router.get('/', (_, res: Response<BlogViewModel[]>) => {
    const blogs = blogsRepository.getAllBlogs()
    res.status(HTTP_STATUSES.OK).json(blogs)
  })

  router.get('/:id', (req: Request<IdURIParam>, res: Response<BlogViewModel>) => {
    const id = req.params.id

    const blog = blogsRepository.getBlogById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    res.status(HTTP_STATUSES.OK).send(blog)
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
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).json(newBlog)
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
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      const updateResult = blogsRepository.updateBlog(id, req.body)

      if (!updateResult) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.delete('/:id', basicAuthMiddleware, (req: Request<IdURIParam>, res: Response) => {
    const id = req.params.id

    const blog = blogsRepository.getBlogById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    const deleteResult = blogsRepository.deleteBlogById(id)

    if (!deleteResult) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
