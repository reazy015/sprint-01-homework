import {HTTP_STATUSES} from './../../src/utils/constants'
import {app} from '../../src/app'
import request from 'supertest'
import {BlogInputModel} from '../../src/types/blog'
import {CREDENTIALS} from './constants'
import {PostInputModel} from '../../src/types/post'

describe('/blogs', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('GET /blogs should return 200 and empty array, no queries specified, default values using', async () => {
    const getResponse = await request(app).get('/blogs').expect(HTTP_STATUSES.OK)

    expect(getResponse.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    })
  })

  it('GET /blogs should return 400 if incorrect queries', async () => {
    await request(app)
      .get('/blogs?sortDir=incorrect&sortBy=123123123')
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('GET /blogs should return 400, if queries specified but has no values', async () => {
    await request(app)
      .get('/blogs?sortDir=&sortBy=&pageSize=&pageNumber=')
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /blogs should return 401 if user unauthorized', async () => {
    await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, 'wrong_pass')
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('POST /blogs should return 400 errors if input model incorrent', async () => {
    const newBlog: BlogInputModel = {
      name: '',
      description: '',
      websiteUrl: '',
    }

    await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /blogs should return 201 if input model is correct, use GET to check creted blog', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postBlogResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.CREATED)

    const getBlogByIdResponse = await request(app)
      .get(`/blogs/${postBlogResponse.body.id}`)
      .expect(HTTP_STATUSES.OK)

    expect(getBlogByIdResponse.body).toEqual({
      id: expect.any(String),
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
      isMembership: expect.any(Boolean),
      createdAt: expect.any(String),
    })
  })

  it('PUT /blogs/:id should return 401 if user unauthorized', async () => {
    await request(app)
      .put(`/blogs/some_id`)
      .auth(CREDENTIALS.LOGIN, 'wrong_pass')
      .send({})
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('PUT /blogs/:id should return 404 if blog not found', async () => {
    const blogUpdate: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    await request(app)
      .put('/blogs/651c05cc013f52cb98c51302')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(blogUpdate)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('PUT /blogs/:id should return 400 if input model incorrect, use POST', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .put(`/blogs/${postResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send({
        ...newBlog,
        websiteUrl: '',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('PUT /blogs/:id should return 204 if input model correct, use POST', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .put(`/blogs/${postResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.NO_CONTENT)
  })

  it('DELETE /blogs/:id should return 401 if not authorized', async () => {
    await request(app)
      .delete('/blogs/some_id')
      .auth(CREDENTIALS.LOGIN, 'wrong_pass')
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('DELETE /blogs/:id should return 404 if not found', async () => {
    await request(app)
      .delete('/blogs/651c05cc013f52cb98c51302')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('DELETE /blogs/:id should return 204 if delete success, use POST', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .delete(`/blogs/${postResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.NO_CONTENT)
  })

  it('GET /blogs/:id/posts should return 400 if blogid is invalid', async () => {
    await request(app).get('/blogs/invalid_id/posts').expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('GET /blogs/:id/posts, should return 400 if queries are incorrect', async () => {
    await request(app)
      .get(
        '/blogs/651c05cc013f52cb98c51302/posts?sortBy=&sortDirection=12312&pageNumber=&pageSize=',
      )
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('GET /blogs/:id/posts, should return 200 and empty items array', async () => {
    const getResponse = await request(app)
      .get('/blogs/651c05cc013f52cb98c51302/posts')
      .expect(HTTP_STATUSES.OK)
    expect(getResponse.body.items).toEqual([])
  })

  it('POST /blogs/:id/posts should return 400 if blogid is invalid', async () => {
    await request(app).post('/blogs/invalid_id/posts').expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /blogs/:id/posts should return 404 if blog not found', async () => {
    await request(app).post('/blogs/651c05cc013f52cb98c51302/posts').expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('POST /blogs/:id/posts should return 400 if input data model is invalid, use POST /blogs to create blog first', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postBlogResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.CREATED)

    const newPost: PostInputModel = {
      title: '',
      shortDescription: '',
      content: '',
      blogId: postBlogResponse.body.id,
    }

    await request(app)
      .post(`/blogs/${postBlogResponse.body.id}/posts`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newPost)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /blogs/:id/posts, should return 201 and newly created post, use POST /blogs to create blog first', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postBlogResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(HTTP_STATUSES.CREATED)

    const newPost: PostInputModel = {
      title: 'title',
      shortDescription: 'shortDescription',
      content: 'content',
      blogId: postBlogResponse.body.id,
    }

    const postCreatedResponse = await request(app)
      .post(`/blogs/${postBlogResponse.body.id}/posts`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newPost)
      .expect(HTTP_STATUSES.CREATED)

    expect(postCreatedResponse.body).toEqual({
      ...newPost,
      id: postCreatedResponse.body.id,
      createdAt: expect.any(String),
      blogName: newBlog.name,
    })
  })
})
