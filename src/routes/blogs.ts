import express, {Request, Response} from 'express'
import {BlogInputModel, BlogViewModel} from '../types/blog'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {postBlogValidateMiddleware} from '../middleware/blog-validate-middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {
  BlogQueryParams,
  CustomQueryRequest,
  CustomRequest,
  IdURIParam,
  WithPaging,
} from '../types/common'
import {HTTP_STATUSES} from '../utils/constants'
import {PostInputModel, PostViewModel} from '../types/post'
import {blogExistanceCheckMiddleware} from '../middleware/blog-existance-check-schema'
import {validIdCheckMiddleware} from '../middleware/valid-id-check-middleware'
import {postByBlogValidateMiddleware} from '../middleware/post-validate-middleware-'
import {blogsCommandRepository} from '../repositories/command/blogs-command-repository'
import {blogsQueryRepository} from '../repositories/query/blogs-query-repository'

export const getBlogsRouter = () => {
  const router = express.Router()

  router.get(
    '/',
    // queryBlogValidateMiddleware(),
    // validationErrorMiddleware,
    async (
      req: CustomQueryRequest<Partial<BlogQueryParams>>,
      res: Response<WithPaging<BlogViewModel>>,
    ) => {
      const blogs = await blogsQueryRepository.getAllBlogs(req.query)

      res.status(HTTP_STATUSES.OK).json(blogs)
    },
  )

  router.get(
    '/:id',
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    ...blogExistanceCheckMiddleware,
    async (req: Request<IdURIParam>, res: Response<BlogViewModel>) => {
      const id = req.params.id

      const blog = await blogsQueryRepository.getBlogById(id)

      if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      res.status(HTTP_STATUSES.OK).send(blog)
    },
  )

  router.get(
    '/:id/posts',
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    ...blogExistanceCheckMiddleware,
    async (
      req: CustomQueryRequest<Partial<BlogQueryParams>, IdURIParam>,
      res: Response<WithPaging<PostViewModel>>,
    ) => {
      const posts = await blogsQueryRepository.getAllPostsByBlogId(req.params.id, req.query)

      res.status(HTTP_STATUSES.OK).send(posts)
    },
  )

  router.post(
    '/',
    basicAuthMiddleware,
    postBlogValidateMiddleware,
    validationErrorMiddleware,
    async (req: CustomRequest<BlogInputModel>, res: Response<BlogInputModel>) => {
      const addBlogData = req.body

      const newBlogId = await blogsCommandRepository.addBlog(addBlogData)

      if (!newBlogId) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      const newBlog = await blogsQueryRepository.getBlogById(newBlogId)

      if (!newBlog) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).json(newBlog)
    },
  )

  router.post(
    '/:id/posts',
    basicAuthMiddleware,
    validIdCheckMiddleware(),
    validationErrorMiddleware,
    ...blogExistanceCheckMiddleware,
    postByBlogValidateMiddleware,
    validationErrorMiddleware,
    async (req: CustomRequest<PostInputModel, IdURIParam>, res: Response<PostViewModel>) => {
      const createdPost = await blogsCommandRepository.addPostByBlogId(req.params.id, req.body)

      if (!createdPost) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).send(createdPost)
    },
  )

  router.put(
    '/:id',
    basicAuthMiddleware,
    postBlogValidateMiddleware,
    validationErrorMiddleware,

    async (req: CustomRequest<BlogInputModel, IdURIParam>, res: Response) => {
      const id = req.params.id

      const blog = await blogsQueryRepository.getBlogById(id)

      if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      const updateResult = await blogsCommandRepository.updateBlog(id, req.body)

      if (!updateResult) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.delete('/:id', basicAuthMiddleware, async (req: Request<IdURIParam>, res: Response) => {
    const id = req.params.id

    const blog = await blogsQueryRepository.getBlogById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    const deleteResult = await blogsCommandRepository.deleteBlogById(id)

    if (!deleteResult) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
