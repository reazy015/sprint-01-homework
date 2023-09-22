import {app} from '../../src/app'
import request from 'supertest'
import {BlogInputModel} from '../../src/types/blog'

describe('/blogs', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('GET /blogs should return 200 and empty array', async () => {
    await request(app).get('/blogs').expect(200, [])
  })

  it('POST /blogs should return 401 if user unauthorized', async () => {
    await request(app).post('/blogs').auth('admin', 'wrong_pass').expect(401)
  })

  it('POST /blogs should return 400 errors if input model incorrent', async () => {
    const newBlog: BlogInputModel = {
      name: '',
      description: '',
      websiteUrl: '',
    }

    await request(app).post('/blogs').auth('admin', 'qwerty').send(newBlog).expect(400)
  })
})
