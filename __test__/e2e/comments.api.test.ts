import {app} from '../../src/app'
import request from 'supertest'
import {BlogInputModel} from '../../src/types/blog'
import {PostInputModel} from '../../src/types/post'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {CREDENTIALS} from './constants'
import {ObjectId} from 'mongodb'

const UNAUTH_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('/comments', () => {
  let JWT_TOKEN: string
  let POST_ID: string
  let MY_COMMENT_ID: string
  let ANOTHER_COMMENT_ID: string

  beforeAll(async () => {
    await request(app).delete('/testing/all-data')

    const newUserRequestBody = {
      email: 'valid@email.com',
      login: 'Valid_login',
      password: '313373valid_password',
    }

    const anotherUser = {
      email: 'another_valid@email.com',
      login: 'another_valid_login',
      password: '313373valid_password',
    }

    await request(app)
      .post(`/users`)
      .send(newUserRequestBody)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)

    await request(app)
      .post(`/users`)
      .send(anotherUser)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({loginOrEmail: 'Valid_login', password: '313373valid_password'})

    const anotherLoginResponse = await request(app)
      .post('/auth/login')
      .send({loginOrEmail: anotherUser.login, password: '313373valid_password'})

    JWT_TOKEN = loginResponse.body.accessToken

    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postBlogResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)

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

    POST_ID = newPostResponse.body.id

    const postMyCommentResponse = await request(app)
      .post(`/posts/${POST_ID}/comments`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send({content: 'post to my comment made by my own'})

    const postAnotherCommentResponse = await request(app)
      .post(`/posts/${POST_ID}/comments`)
      .set('Authorization', `Bearer ${anotherLoginResponse.body.accessToken}`)
      .send({content: 'post to my comment made by someone else'})

    MY_COMMENT_ID = postMyCommentResponse.body.id
    ANOTHER_COMMENT_ID = postAnotherCommentResponse.body.id
  })

  it('GET/comments/:id return 400 if invalid id', async () => {
    await request(app).get('/comments/invalid_comment_id').expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('GET/comments/:id return 404 if comment not found', async () => {
    await request(app).get(`/comments/${new ObjectId().toString()}`).expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('GET/comments/:id return comment view model, additional methods: POST/posts/:id/comments', async () => {
    const newComment = {content: 'some new valid comment'}
    const newCommentPostResponse = await request(app)
      .post(`/posts/${POST_ID}/comments`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send(newComment)
      .expect(HTTP_STATUSES.CREATED)

    expect(newCommentPostResponse.body).toEqual({
      id: expect.any(String),
      content: newComment.content,
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String),
      },
      createdAt: expect.any(String),
    })

    const newCommentGetResponse = await request(app)
      .get(`/comments/${newCommentPostResponse.body.id}`)
      .expect(HTTP_STATUSES.OK)

    expect(newCommentGetResponse.body).toEqual({
      id: newCommentPostResponse.body.id,
      content: newComment.content,
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String),
      },
      createdAt: expect.any(String),
    })
  })

  it('PUT/comments/:id return 404 if comment not found', async () => {
    await request(app).put(`/comments/${new ObjectId().toString()}`).expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('PUT/comments/:id return 400 if invalid id', async () => {
    await request(app).put(`/comments/some_invalid_id`).expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('PUT/comments/:id return 401 if unauth', async () => {
    await request(app)
      .put(`/comments/${MY_COMMENT_ID}`)
      .set('Authorization', `Bearer ${UNAUTH_JWT}`)
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('PUT/comments/:id return 403 if trying to modify someone elses comment', async () => {
    await request(app)
      .put(`/comments/${ANOTHER_COMMENT_ID}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send({content: 'valid content for someone elses comment forbidden'})
      .expect(HTTP_STATUSES.FORBIDDEN)
  })

  it('PUT/comments/:id return 400 if input model incorrect', async () => {
    await request(app)
      .put(`/comments/${MY_COMMENT_ID}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send({content: 'invalid'})
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('PUT/comments/:id return 204 if updated successfully', async () => {
    await request(app)
      .put(`/comments/${MY_COMMENT_ID}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send({content: 'valid comment updates with valid jwt toke'})
      .expect(HTTP_STATUSES.NO_CONTENT)
  })

  it('DELETE/comments/:id return 400 if id is invalid', async () => {
    await request(app)
      .delete(`/comments/invalid_comment_id`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('DELETE/comments/:id return 404 if comment not found', async () => {
    await request(app)
      .delete(`/comments/${new ObjectId().toString()}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('DELETE/comments/:id return 401 if unauth', async () => {
    await request(app)
      .delete(`/comments/${MY_COMMENT_ID}`)
      .set('Authorization', `Bearer ${UNAUTH_JWT}`)
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('DELETE/comments/:id return 403 if trying to delete someone elses comment', async () => {
    await request(app)
      .delete(`/comments/${ANOTHER_COMMENT_ID}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .expect(HTTP_STATUSES.FORBIDDEN)
  })

  it('DELETE/comments/:id return 204 if deleted successfully', async () => {
    await request(app)
      .delete(`/comments/${MY_COMMENT_ID}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .expect(HTTP_STATUSES.NO_CONTENT)
  })
})

describe('/posts/:postId/comments', () => {
  let JWT_TOKEN: string
  let POST_ID: string

  beforeAll(async () => {
    await request(app).delete('/testing/all-data')

    const newUserRequestBody = {
      email: 'valid@email.com',
      login: 'Valid_login',
      password: '313373valid_password',
    }

    await request(app)
      .post(`/users`)
      .send(newUserRequestBody)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({loginOrEmail: 'Valid_login', password: '313373valid_password'})

    JWT_TOKEN = loginResponse.body.accessToken

    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postBlogResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)

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

    POST_ID = newPostResponse.body.id
  })

  it('GET/posts/:postId/comments return 404 if post not found', async () => {
    await request(app)
      .get(`/posts/${new ObjectId().toString()}/comments`)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('GET/posts/:postId/comments return 200 and empty items list, additional methods: POST/posts, POST/blogs', async () => {
    const getCommentsResponse = await request(app)
      .get(`/posts/${POST_ID}/comments`)
      .expect(HTTP_STATUSES.OK)

    expect(getCommentsResponse.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    })
  })

  it('POST/posts/:postId/comments return 404 if post not found', async () => {
    await request(app)
      .post(`/posts/${new ObjectId().toString()}/comments`)
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('POST/posts/:postId/comments return 400 comment input model incorrect, additional methods: POST/blogs, POST/posts', async () => {
    await request(app)
      .post(`/posts/${POST_ID}/comments`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send({content: ''})
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST/posts/:postId/comments return 401 if token not verified, additional methods: POST/blogs, POST/posts', async () => {
    await request(app)
      .post(`/posts/${POST_ID}/comments`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlZhbGlkX2xvZ2luIiwiZW1haWwiOiJ2YWxpZEBlbWFpbC5jb20iLCJpZCI6IjY1MmJmOWE5YTU0OWY2Y2QzN2ZiMjY3NSIsImNyZWF0ZWRBdCI6IjIwMjMtMTAtMTVUMTQ6Mzk6MzcuOTE1WiIsImlhdCI6MTY5NzM4MDc5MywiZXhwIjoxNjk3Mzg0MzkzfQ.GYeAXPdPICwufduwf_M05elE4RxcFOIt8bbVcnzC64o',
      )
      .send({content: 'some new valid comment with appropriate length'})
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('POST/posts/:postId/comments return 201 and new comment, additional methods: POST/users, POST/auth/login, POST/blogs, POST/posts', async () => {
    const newComment = {content: 'some new valid comment'}
    const newCommentPostResponse = await request(app)
      .post(`/posts/${POST_ID}/comments`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send(newComment)
      .expect(HTTP_STATUSES.CREATED)

    expect(newCommentPostResponse.body).toEqual({
      id: expect.any(String),
      content: newComment.content,
      commentatorInfo: {
        userId: expect.any(String),
        userLogin: expect.any(String),
      },
      createdAt: expect.any(String),
    })
  })
})
