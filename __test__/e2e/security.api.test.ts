import {app} from '../../src/app'
import request from 'supertest'
import {HTTP_STATUSES} from '../../src/utils/constants'
import {CREDENTIALS} from './constants'

const USER = {
  email: 'valid@email.com',
  login: 'user1_login',
  password: '313373valid_password',
}

const USER2 = {
  email: 'test@test.com',
  login: 'user2_login',
  password: '313373second_test',
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

    it('DELETE /devices return 401 if invalid refresh jwt', async () => {
      await request(app).delete('/security/devices').expect(HTTP_STATUSES.UNAUTH)
    })

    it('DELETE /devices return 204, devices list should contain current session; additional methods: POST/auth/login, GET/devices', async () => {
      const {login, password} = USER

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const refreshToken = loginResponse.headers['set-cookie']

      await request(app)
        .delete('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.NO_CONTENT)

      const devicesListResponse = await request(app)
        .get('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.OK)

      expect(devicesListResponse.body.length).toBe(1)
    })

    it('DELETE /devices/:deviceId return 401 if invalid refresh jwt', async () => {
      const {login, password} = USER

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const refreshToken = loginResponse.headers['set-cookie']

      await request(app)
        .delete('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.NO_CONTENT)

      const devicesListResponse = await request(app)
        .get('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.OK)

      await request(app)
        .delete(`/security/devices/${devicesListResponse.body[0].deviceId}`)
        .expect(HTTP_STATUSES.UNAUTH)
    })

    it('DELETE /devices/:deviceId return 403 if device belongs to other user', async () => {
      const {login, password, email} = USER

      await request(app)
        .post(`/users`)
        .send(USER2)
        .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
        .expect(HTTP_STATUSES.CREATED)

      const loginResponse1 = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const loginResponse2 = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: USER2.login, password: USER2.password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const refreshToken1 = loginResponse1.headers['set-cookie']
      const refreshToken2 = loginResponse2.headers['set-cookie']

      const devicesResponse1 = await request(app)
        .get('/security/devices')
        .set('Cookie', refreshToken1)
        .expect(HTTP_STATUSES.OK)

      await request(app)
        .delete(`/security/devices/${devicesResponse1.body[0].deviceId}`)
        .set('Cookie', refreshToken2)
        .expect(HTTP_STATUSES.FORBIDDEN)
    })

    it('DELETE /devices/:deviceId return 404 if device not found', async () => {
      const {login, password} = USER

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const refreshToken = loginResponse.headers['set-cookie']

      await request(app)
        .delete('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.NO_CONTENT)

      await request(app)
        .delete(`/security/devices/invalid_id`)
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.NOT_FOUND)
    })

    it('DELETE /devices/:deviceId return 204 if deleted successfuly', async () => {
      const {login, password} = USER

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const refreshToken = loginResponse.headers['set-cookie']

      const devicesResponse = await request(app)
        .get('/security/devices')
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.OK)

      await request(app)
        .delete(`/security/devices/${devicesResponse.body[0].deviceId}`)
        .set('Cookie', refreshToken)
        .expect(HTTP_STATUSES.NO_CONTENT)
    })

    it('GET /devices should return 200 list without logged out device; additional methods: POST/auth/logout', async () => {
      const {login, password} = USER

      const loginResponse1 = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_1')
        .expect(HTTP_STATUSES.OK)

      const loginResponse2 = await request(app)
        .post('/auth/login')
        .send({loginOrEmail: login, password})
        .set('user-agent', 'desktop_test_2')
        .expect(HTTP_STATUSES.OK)

      const refreshToken1 = loginResponse1.headers['set-cookie']
      const refreshToken2 = loginResponse2.headers['set-cookie']

      const devicesResponse1 = await request(app)
        .get('/security/devices')
        .set('Cookie', refreshToken1)
        .expect(HTTP_STATUSES.OK)

      await request(app)
        .post('/auth/logout')
        .set('Cookie', refreshToken1)
        .expect(HTTP_STATUSES.NO_CONTENT)

      const devicesResponse2 = await request(app)
        .get(`/security/devices`)
        .set('Cookie', refreshToken2)
        .expect(HTTP_STATUSES.OK)

      expect(devicesResponse2.body.length).toBe(devicesResponse1.body.length - 1)
    })
  })
})
