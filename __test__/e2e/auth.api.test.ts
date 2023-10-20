import {app} from '../../src/app'
import request from 'supertest'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {CREDENTIALS} from './constants'
import {jest} from '@jest/globals'
import {CustomRequest} from '../../src/types/common'

const sendMailMock = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}))

const emailConfirmationCode = (template: string) => template.match(/code=(.*?)\'/)![1]

describe('Auth api', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  afterEach(async () => {
    await request(app).delete('/testing/all-data')

    sendMailMock.mockClear()
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

  it('POST/auth/registration return 400 if input model incorrect', async () => {
    const inputData = {
      login: 'lo',
      password: 'pas',
    }

    const postRegResponse = await request(app)
      .post('/auth/registration')
      .send(inputData)
      .expect(HTTP_STATUSES.BAD_REQUEST)

    expect(postRegResponse.body).toEqual({
      errorsMessages: [
        {
          field: 'login',
          message: expect.any(String),
        },
        {
          field: 'password',
          message: expect.any(String),
        },
        {
          field: 'email',
          message: expect.any(String),
        },
      ],
    })
  })

  it('POST/auth/registration return 204 if data accepted, email sent with template including code query param', async () => {
    const inputData = {
      login: 'login',
      password: 'password',
      email: 'stub@mail.com',
    }

    await request(app).post('/auth/registration').send(inputData).expect(HTTP_STATUSES.NO_CONTENT)

    expect(sendMailMock).toBeCalledTimes(1)

    // @ts-ignore
    const confirmationCode = emailConfirmationCode(sendMailMock.mock.calls[0][0].html)

    expect(confirmationCode).toEqual(expect.any(String))
  })

  it('POST/auth/registration-confirmation --> 400 if code incorrect', async () => {
    await request(app)
      .post('/auth/registration-confirmation')
      .send({code: ''})
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST/auth/registration-confirmation --> 204 if email verified, account activated; additional methods: POST/auth/registration', async () => {
    const inputData = {
      login: 'login',
      password: 'password',
      email: 'stub@mail.com',
    }

    await request(app).post('/auth/registration').send(inputData).expect(HTTP_STATUSES.NO_CONTENT)

    // @ts-ignore
    const confirmationCode = emailConfirmationCode(sendMailMock.mock.calls[0][0].html)

    await request(app)
      .post('/auth/registration-confirmation')
      .send({code: confirmationCode})
      .expect(HTTP_STATUSES.NO_CONTENT)
  })

  it('POST/auth/registration-email-resending --> 400 if email incorrect', async () => {
    await request(app)
      .post('/auth/registration-email-resending')
      .send({email: ''})
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST/auth/registration-email-resending --> 204 if email resent; additional methods: POST/auth/registration', async () => {
    const inputData = {
      login: 'login',
      password: 'password',
      email: 'stub@mail.com',
    }

    await request(app).post('/auth/registration').send(inputData).expect(HTTP_STATUSES.NO_CONTENT)

    sendMailMock.mockClear()

    await request(app)
      .post('/auth/registration-email-resending')
      .send({email: 'stub@mail.com'})
      .expect(HTTP_STATUSES.NO_CONTENT)

    expect(sendMailMock).toBeCalledTimes(1)

    // @ts-ignore
    const confirmationCode = emailConfirmationCode(sendMailMock.mock.calls[0][0].html)

    expect(confirmationCode).toEqual(expect.any(String))
  })
})
