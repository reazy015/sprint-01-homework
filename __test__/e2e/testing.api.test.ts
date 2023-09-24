import {app} from '../../src/app'
import request from 'supertest'

describe('/posts', () => {
  it('should return 204 code', async () => {
    await request(app).delete('/testing/all-data')
  })
})
