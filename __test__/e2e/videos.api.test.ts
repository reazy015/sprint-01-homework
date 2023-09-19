import {app} from '../../src/app'
import request from 'supertest'

describe('/videos', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('GET /videos should return 200 and empty array', async () => {
    await request(app).get('/videos').expect(200, [])
  })

  it('POST /videos should not create video with incorrect data', async () => {
    await request(app).post('/videos').send({title: 'test_title'}).expect(400)
  })
})
