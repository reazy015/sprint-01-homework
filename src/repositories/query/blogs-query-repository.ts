import {ObjectId} from 'mongodb'
import {Blog, BlogViewModel, DbBlog} from '../../types/blog'
import {BlogQueryParams, WithPaging} from '../../types/common'
import {db} from '../../db/db'
import {DbPost, PostViewModel} from '../../types/post'

const blogsCollection = db.collection<DbBlog>('blogs')
const postsCollection = db.collection<DbPost>('posts')

const DEFAULT_QUERY_PARAMS = {
  searchTermName: '',
  pageSize: 10,
  pageNumber: 1,
  sortBy: 'createdAt',
  sortDirection: 'desc',
}

export const blogsQueryRepository = {
  async getAllBlogs(queryParams: Partial<BlogQueryParams>): Promise<WithPaging<BlogViewModel>> {
    const {
      searchNameTerm = DEFAULT_QUERY_PARAMS.searchTermName,
      // pageSize = DEFAULT_QUERY_PARAMS.pageSize,
      // pageNumber = DEFAULT_QUERY_PARAMS.pageNumber,
      sortDirection = DEFAULT_QUERY_PARAMS.sortDirection,
    } = queryParams

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
    const filter = {name: {$regex: searchNameTerm, $options: 'i'}}
    const skip = pageSize * (pageNumber - 1)

    const blogs = await blogsCollection
      .find(filter)
      .sort({[sortBy]: sortDir})
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalBlogsCount = await blogsCollection.countDocuments(filter)

    return {
      pagesCount: Math.ceil(totalBlogsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalBlogsCount,
      items: blogs.map<BlogViewModel>((blog) => ({
        id: blog._id.toString(),
        name: blog.name,
        websiteUrl: blog.websiteUrl,
        description: blog.description,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      })),
    }
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

    if (blog) {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      }
    }

    return null
  },
  async getAllPostsByBlogId(
    id: string,
    queryParams: Partial<BlogQueryParams>,
  ): Promise<WithPaging<PostViewModel>> {
    const {
      // pageSize = DEFAULT_QUERY_PARAMS.pageSize,
      // pageNumber = DEFAULT_QUERY_PARAMS.pageNumber,
      sortDirection = DEFAULT_QUERY_PARAMS.sortDirection,
    } = queryParams
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
      .find({blogId: id})
      .sort({[sortBy]: sortDir})
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const postsTotalCount = await postsCollection.countDocuments({blogId: id})

    return {
      pagesCount: Math.ceil(postsTotalCount / pageSize),
      totalCount: postsTotalCount,
      page: pageNumber,
      pageSize: pageSize,
      items: posts.map<PostViewModel>((post) => ({
        id: post._id.toString(),
        blogName: post.blogName,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        createdAt: post.createdAt,
      })),
    }
  },
}
