import {app} from '../../src/app'
import request from 'supertest'
import {BlogInputModel} from '../../src/types/blog'
import {PostInputModel} from '../../src/types/post'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {CREDENTIALS} from './constants'

describe('/posts', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('GET /posts should return 200 and empty array', async () => {
    await request(app).get('/posts').expect(HTTP_STATUSES.OK, [])
  })

  it('GET /posts/:id should return 404 if no post with such id', async () => {
    await request(app).get('/posts/some_id').expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('GET /posts/:id should return 200 and post if it exists, use POST to create blog and post first', async () => {
    const newBlog: BlogInputModel = {
      name: 'blog_name',
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

    const newPostResponse = await request(app)
      .post('/posts')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newPost)
      .expect(HTTP_STATUSES.CREATED)

    const getPostByIdResponse = await request(app)
      .get(`/posts/${newPostResponse.body.id}`)
      .expect(HTTP_STATUSES.OK)

    expect(getPostByIdResponse.body).toEqual({
      id: newPostResponse.body.id,
      title: 'title',
      shortDescription: 'shortDescription',
      content: 'content',
      blogId: postBlogResponse.body.id,
      blogName: newBlog.name,
      createdAt: expect.any(String),
    })
  })

  it('POST /posts should return 401 if user unauthorized', async () => {
    await request(app)
      .post('/posts')
      .auth(CREDENTIALS.LOGIN, 'wrong_pass')
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('POST /posts should return 400 errors if input model incorrent, no blog with given ID', async () => {
    const newPost: PostInputModel = {
      title: 'title',
      shortDescription: 'shortDescription',
      content: 'content',
      blogId: 'blogId',
    }

    await request(app)
      .post('/posts')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newPost)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /posts should return 201 errors if input model correct, use POST to create blog first', async () => {
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

    const newPostResponse = await request(app)
      .post('/posts')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newPost)
      .expect(HTTP_STATUSES.CREATED)

    expect(newPostResponse.body).toEqual({
      id: newPostResponse.body.id,
      title: 'title',
      shortDescription: 'shortDescription',
      content: 'content',
      blogId: postBlogResponse.body.id,
      blogName: newBlog.name,
      createdAt: expect.any(String),
    })
  })

  it('PUT /posts/:id should return 401 if user unauthorized', async () => {
    await request(app)
      .put(`/posts/some_id`)
      .auth(CREDENTIALS.LOGIN, 'wrong_pass')
      .send({})
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('PUT /posts/:id should return 400 if blog not found', async () => {
    const postUpdate: PostInputModel = {
      title: 'title',
      shortDescription: 'shortDescription',
      content: 'content',
      blogId: 'not_existed_id',
    }

    await request(app)
      .put('/blogs/not_exists_id')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(postUpdate)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('PUT /posts/:id should return 404 if post not found, use POST to create blog first', async () => {
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

    const postUpdate: PostInputModel = {
      title: 'title',
      shortDescription: 'shortDescription',
      content: 'content',
      blogId: postBlogResponse.body.id,
    }

    await request(app)
      .put('/posts/not_exists_id')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(postUpdate)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('PUT /posts/:id should return 204 if input model correct, use POST to create blog first', async () => {
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

    const newPostResponse = await request(app)
      .post('/posts')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newPost)
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .put(`/posts/${newPostResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send({
        ...newPost,
        title: 'udated title',
      })
      .expect(HTTP_STATUSES.NO_CONTENT)
  })

  it('DELETE /posts/:id should return HTTP_STATUSES.UNAUTH if not authorized', async () => {
    await request(app)
      .delete('/posts/some_id')
      .auth(CREDENTIALS.LOGIN, 'wrong_pass')
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('DELETE /posts/:id should return 404 if not found', async () => {
    await request(app)
      .delete('/posts/some_id')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('DELETE /blogs/:id should return 204 if delete success, use POST to create blog and post, GET to check afterwords', async () => {
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

    const newPostResponse = await request(app)
      .post('/posts')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newPost)
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .delete(`/posts/${newPostResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.NO_CONTENT)

    await request(app)
      .get(`/posts/${newPostResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })
})
