import {app} from '../../src/app'
import request from 'supertest'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {CREDENTIALS} from './constants'

describe('Auth api', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('POST /auth/login returns 400 if invalid request body params', async () => {
    await request(app)
      .post('/auth/login')
      .send({loginOrEmail: '', password: ''})
      .expect(HTTP_STATUSES.BAD_REQUEST)
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

    await request(app)
      .post('/auth/login')
      .send({loginOrEmail: 'Valid_login', password: '313373valid_password'})
      .expect(HTTP_STATUSES.UNAUTH)
  })
})
