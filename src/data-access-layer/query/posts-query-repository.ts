import {ObjectId} from 'mongodb'
import {PostQueryParams, WithPaging} from '../../types/common'
import {DbPost, PostViewModel} from '../../types/post'
import {db} from '../../db/db'

const postsCollection = db.collection<DbPost>('posts')

const DEFAULT_QUERY_PARAMS = {
  searchTermName: '',
  pageSize: 10,
  pageNumber: 1,
  sortBy: 'createdAt',
  sortDirection: 'desc',
}

export const postQueryRepository = {
  async getAllPosts(queryParams: Partial<PostQueryParams>): Promise<WithPaging<PostViewModel>> {
    const {
      pageSize = DEFAULT_QUERY_PARAMS.pageSize,
      pageNumber = DEFAULT_QUERY_PARAMS.pageNumber,
      sortBy = DEFAULT_QUERY_PARAMS.sortBy,
      sortDirection = DEFAULT_QUERY_PARAMS.sortDirection,
    } = queryParams

    const sortDir = sortDirection === 'asc' ? 1 : -1
    const skip = pageNumber * (pageSize - 1)

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
}
