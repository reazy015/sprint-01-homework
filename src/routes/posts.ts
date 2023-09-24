import express, {Request, Response} from 'express'
import {postsRepository} from '../data-access-layer/post-repository'
import {PostInputModel, PostViewModel} from '../types/post'
import {basicAuthMiddleware} from '../middleware/basic-auth-middleware'
import {validationErrorMiddleware} from '../middleware/validation-error-middleware'
import {postValidateMiddleware} from '../middleware/post-validate-middleware-'
import {blogsRepository} from '../data-access-layer/blogs-repository'
import {CustomRequest, IdURIParam} from '../types/common'
import {HTTP_STATUSES} from '../utils/constants'

export const getPostsRouter = () => {
  const router = express.Router()

  router.get('/', (_, res: Response<PostViewModel[]>) => {
    const posts = postsRepository.getAllPosts()
    const postsWithBlogName = posts.map((post) => {
      const blog = blogsRepository.getBlogById(post.blogId)

      return {
        ...post,
        blogName: blog?.name ?? '',
      }
    })

    res.status(HTTP_STATUSES.OK).json(postsWithBlogName)
  })

  router.get('/:id', (req: Request<IdURIParam>, res: Response<PostViewModel>) => {
    const postId = req.params.id

    const post = postsRepository.getPostById(postId)

    if (!post) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    const blog = blogsRepository.getBlogById(post.blogId)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    res.status(HTTP_STATUSES.OK).send({...post, blogName: blog.name})
  })

  router.post(
    '/',
    basicAuthMiddleware,
    postValidateMiddleware(),
    validationErrorMiddleware,
    (req: CustomRequest<PostInputModel>, res: Response<PostViewModel>) => {
      const blogId = req.body.blogId
      const blog = blogsRepository.getBlogById(blogId)

      if (!blog) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      const newPostId = postsRepository.addPost(req.body)

      const newPost = postsRepository.getPostById(newPostId)

      if (!newPost) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.status(HTTP_STATUSES.CREATED).json({
        ...newPost,
        blogName: blog.name,
      })
    },
  )

  router.put(
    '/:id',
    basicAuthMiddleware,
    postValidateMiddleware(),
    validationErrorMiddleware,

    (req: CustomRequest<PostInputModel, IdURIParam>, res: Response) => {
      const postId = req.params.id

      const post = postsRepository.getPostById(postId)

      if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      const postUpdated = postsRepository.updatePost(postId, req.body)

      if (!postUpdated) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    },
  )

  router.delete('/:id', basicAuthMiddleware, (req: Request<IdURIParam>, res: Response) => {
    const id = req.params.id

    const blog = postsRepository.getPostById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    const deleteResult = postsRepository.deletePost(id)

    if (!deleteResult) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
