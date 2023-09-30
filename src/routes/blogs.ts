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

  router.get('/', async (_, res: Response<BlogViewModel[]>) => {
    const blogs = await blogsRepository.getAllBlogs()
    res.status(HTTP_STATUSES.OK).json(blogs)
  })

  router.get('/:id', async (req: Request<IdURIParam>, res: Response<BlogViewModel>) => {
    const id = req.params.id

    const blog = await blogsRepository.getBlogById(id)

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

    async (req: CustomRequest<BlogInputModel>, res: Response<BlogInputModel>) => {
      const addBlogData = req.body

      const newBlogId = await blogsRepository.addBlog(addBlogData)

      if (!newBlogId) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      const newBlog = await blogsRepository.getBlogById(newBlogId)

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

    async (req: CustomRequest<BlogInputModel, IdURIParam>, res: Response) => {
      const id = req.params.id

      const blog = await blogsRepository.getBlogById(id)

      if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      const updateResult = await blogsRepository.updateBlog(id, req.body)

      if (!updateResult) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.delete('/:id', basicAuthMiddleware, async (req: Request<IdURIParam>, res: Response) => {
    const id = req.params.id

    const blog = await blogsRepository.getBlogById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    const deleteResult = await blogsRepository.deleteBlogById(id)

    if (!deleteResult) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
