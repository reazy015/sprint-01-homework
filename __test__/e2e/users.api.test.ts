import {app} from '../../src/app'
import request from 'supertest'
import {CREDENTIALS} from './constants'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {ObjectId} from 'mongodb'

describe('Users api', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('GET /users returns 401 if invalid credentials', async () => {
    await request(app)
      .get('/users')
      .auth(CREDENTIALS.LOGIN, 'INVALID_PASSWORD')
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('GET /users return 200 and empty array with incorrect queries', async () => {
    await request(app)
      .get('/users?sortBy=123123&sortDirection=never&pageSize=-1&pageNumber=0')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.OK, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      })
  })

  it('GET /users return 200 and empty items array with paging default values', async () => {
    await request(app)
      .get('/users')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.OK, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      })
  })

  it('GET /users return 200 and empty items array with sent page size/number queries', async () => {
    const pageSize = 20
    const pageNumber = 5

    await request(app)
      .get(`/users?pageSize=${pageSize}&pageNumber=${pageNumber}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.OK, {
        pagesCount: 0,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: 0,
        items: [],
      })
  })

  it('POST /users return 401 if credentials invalid', async () => {
    await request(app)
      .post(`/users`)
      .auth(CREDENTIALS.LOGIN, 'invalid_password')
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('POST /users return 400 if email invalid', async () => {
    await request(app)
      .post(`/users`)
      .send({
        email: 123123,
        login: 'login',
        password: 'password',
      })
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /users return 400 if login invalid', async () => {
    await request(app)
      .post(`/users`)
      .send({
        email: 'valid@email.com',
        login: 'a2',
        password: 'password',
      })
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /users return 400 if password invalid', async () => {
    await request(app)
      .post(`/users`)
      .send({
        email: 'valid@email.com',
        login: 'Valid_login',
        password: 1,
      })
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /users return 201 and created user, additionalMethod: GET /users', async () => {
    const newUserRequestBody = {
      email: 'valid@email.com',
      login: 'Valid_login',
      password: '313373valid_password',
    }

    const postResponse = await request(app)
      .post(`/users`)
      .send(newUserRequestBody)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.CREATED)

    expect(postResponse.body).toEqual({
      id: expect.any(String),
      email: newUserRequestBody.email,
      login: newUserRequestBody.login,
      createdAt: expect.any(String),
    })

    const getResponse = await request(app)
      .get('/users')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.OK)

    expect(getResponse.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: postResponse.body.id,
          email: newUserRequestBody.email,
          login: newUserRequestBody.login,
          createdAt: expect.any(String),
        },
      ],
    })
  })

  it('DELETE /users/:id should return 400 if user id invalid', async () => {
    await request(app).delete('/users/invalid_id').expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('DELETE /users/:id should return 404 if user not found', async () => {
    const userId = new ObjectId()
    await request(app).delete(`/users/${userId.toString()}`).expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('DELETE /users/:id should return 204 if user not found, additional methods POST/users', async () => {
    const newUserRequestBody = {
      email: 'valid@email.com',
      login: 'Valid_login',
      password: '313373valid_password',
    }

    const postResponse = await request(app)
      .post(`/users`)
      .send(newUserRequestBody)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.CREATED)

    await request(app).delete(`/users/${postResponse.body.id}`).expect(HTTP_STATUSES.NO_CONTENT)
  })
})
