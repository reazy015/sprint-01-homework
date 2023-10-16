import {app} from '../../src/app'
import request from 'supertest'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {CREDENTIALS} from './constants'

describe('Auth api', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('POST /auth/login returns 400 if invalid request body params', async () => {
    const postResponse = await request(app)
      .post('/auth/login')
      .send({loginOrEmail: 123123123, password: ''})
      .expect(HTTP_STATUSES.BAD_REQUEST)

    expect(postResponse.body).toEqual({
      errorsMessages: [
        {message: expect.any(String), field: 'loginOrEmail'},
        {message: expect.any(String), field: 'password'},
      ],
    })
  })

  it('POST /auth/login returns 401 if request valid, but no such user', async () => {
    await request(app)
      .post('/auth/login')
      .send({loginOrEmail: 'login', password: 'password'})
      .expect(HTTP_STATUSES.UNAUTH)
  })

  it('POST /auth/login returns 204 if login successfully, additional methods: POST/users', async () => {
    const newUserRequestBody = {
      email: 'valid@email.com',
      login: 'Valid_login',
      password: '313373valid_password',
    }

    await request(app)
      .post(`/users`)
      .send(newUserRequestBody)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.CREATED)

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({loginOrEmail: 'Valid_login', password: '313373valid_password'})
      .expect(HTTP_STATUSES.OK)

    expect(loginResponse.body).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('GET/auth/me should 401 if unauthorized', async () => {
    await request(app).get('/auth/me').expect(HTTP_STATUSES.UNAUTH)
  })

  it('GET/auth/me should 200 and user id, additional methods: POST/users, POST/auth/login', async () => {
    const newUserRequestBody = {
      email: 'valid@email.com',
      login: 'Valid_login',
      password: '313373valid_password',
    }

    await request(app)
      .post(`/users`)
      .send(newUserRequestBody)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .expect(HTTP_STATUSES.CREATED)

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({loginOrEmail: 'Valid_login', password: '313373valid_password'})
      .expect(HTTP_STATUSES.OK)

    await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(HTTP_STATUSES.OK)
  })
})
