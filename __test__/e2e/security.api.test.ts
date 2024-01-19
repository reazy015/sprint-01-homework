import {app} from '../../src/app'
import request from 'supertest'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {CREDENTIALS} from './constants'
import {extractCookie} from './utils/extract-cookie'

const USER = {
  email: 'valid@email.com',
  login: 'Valid_login',
  password: '313373valid_password',
}

describe('/security', () => {
  describe('/devices', () => {
    beforeAll(async () => {
      await request(app).delete('/testing/all-data')
    })

    beforeEach(async () => {
      await request(app)
        .post(`/users`)
        .send(USER)
        .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
        .expect(HTTP_STATUSES.CREATED)
    })

    afterEach(async () => {
      await request(app).delete('/testing/all-data')
    })

    afterAll(async () => {
      await request(app)
        .post(`/users`)
        .send(USER)
        .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
        .expect(HTTP_STATUSES.CREATED)
    })

    it('GET /devices return 401 if refresh token not specified ', async () => {
      await request(app).get('/security/devices').expect(HTTP_STATUSES.UNAUTH)
    })

    it('GET /devices should return 200 and devices list; additional methods: POST /login', async () => {
      const {login, password} = USER
      let loginResponse

      for (let i = 0; i < 4; i++) {
        loginResponse = await request(app)
          .post('/auth/login')
          .send({loginOrEmail: login, password})
          .set('user-agent', `desktop_test_${i}`)
          .expect(HTTP_STATUSES.OK)
      }

      const refreshToken = loginResponse!.headers['set-cookie']

      const devicesResponse = await request(app)
        .get('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.OK)

      console.log(devicesResponse.body)

      expect(devicesResponse.body.length).toEqual(4)
    })

    it('GET /devices should return 200 and the same list (length, deviceId) after token refresh; additional methods: POST /login, POST/auth/refresh-token', async () => {
      const {login, password} = USER

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const refreshToken = loginResponse.headers['set-cookie']

      const listBeforeTokenRefresh = await request(app)
        .get('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.OK)

      const refreshTokenResponse = await request(app)
        .post('/auth/refresh-token')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.OK)

      const newRefreshToken = refreshTokenResponse.headers['set-cookie']

      const listAfterTokenRefresh = await request(app)
        .get('/security/devices')
        .set('Cookie', newRefreshToken)
        .expect(HTTP_STATUSES.OK)

      expect(listBeforeTokenRefresh.body.length).toEqual(listAfterTokenRefresh.body.length)
    })
  })
})
