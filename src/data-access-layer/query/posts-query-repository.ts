import {ObjectId} from 'mongodb'
import {CommentQueryParams, PostQueryParams, WithPaging} from '../../types/common'
import {DbPost, PostViewModel} from '../../types/post'
import {db} from '../../db/db'
import {CommentViewModel, DbComment} from '../../types/comment'

const postsCollection = db.collection<DbPost>('posts')
const commentsCollection = db.collection<DbComment>('comments')

const DEFAULT_QUERY_PARAMS = {
  searchTermName: '',
  pageSize: 10,
  pageNumber: 1,
  sortBy: 'createdAt',
  sortDirection: 'desc',
}

export const postQueryRepository = {
  async getAllPosts(queryParams: Partial<PostQueryParams>): Promise<WithPaging<PostViewModel>> {
    const {sortDirection = DEFAULT_QUERY_PARAMS.sortDirection} = queryParams
    const pageSize =
      queryParams.pageSize && Number.isInteger(+queryParams.pageSize) ? +queryParams.pageSize : 10
    const pageNumber =
      queryParams.pageNumber && Number.isInteger(+queryParams.pageNumber)
        ? +queryParams.pageNumber
        : 1

    const sortBy =
      queryParams.sortBy && Boolean(queryParams.sortBy.trim())
        ? queryParams.sortBy
        : DEFAULT_QUERY_PARAMS.sortBy

    const sortDir = sortDirection === 'asc' ? 1 : -1
    const skip = pageSize * (pageNumber - 1)

    const posts = await postsCollection
      .find()
      .sort({[sortBy]: sortDir})
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalPostsCount = await postsCollection.countDocuments()

    return {
      pagesCount: Math.ceil(totalPostsCount / pageSize),
      totalCount: totalPostsCount,
      page: pageNumber,
      pageSize: pageSize,
      items: posts.map<PostViewModel>((post) => ({
        id: post._id.toString(),
        blogId: post.blogId,
        blogName: post.blogName,
        title: post.title,
        content: post.content,
        shortDescription: post.shortDescription,
        createdAt: post.createdAt,
      })),
    }
  },
  async getPostById(id: string): Promise<PostViewModel | null> {
    const post = await postsCollection.findOne({_id: new ObjectId(id)})

    return post
      ? {
          id: post._id.toString(),
          blogId: post.blogId,
          blogName: post.blogName,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          createdAt: post.createdAt,
        }
      : null
  },
  async getCommentsByPostId(
    postId: string,
    queryParams: CommentQueryParams,
  ): Promise<WithPaging<CommentViewModel>> {
    const {sortBy, sortDirection, pageNumber, pageSize} = queryParams
    const sort = sortDirection === 'asc' ? 1 : -1

    const totalCommentsCount = await commentsCollection.countDocuments()
    const comments = await commentsCollection
      .find({postId: postId})
      .sort({[sortBy]: sort})
      .skip(+pageSize * (+pageNumber - 1))
      .limit(+pageSize)
      .toArray()

    return {
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCommentsCount,
      pagesCount: Math.ceil(totalCommentsCount / +pageSize),
      items: comments.map((comment) => ({
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
      })),
    }
  },
}
