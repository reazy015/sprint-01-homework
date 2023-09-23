import {app} from '../../src/app'
import request from 'supertest'
import {BlogInputModel} from '../../src/types/blog'

const CREDENTIALS = {
  LOGIN: 'admin',
  PASSWORD: 'qwerty',
}

describe('/blogs', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('GET /blogs should return 200 and empty array', async () => {
    await request(app).get('/blogs').expect(200, [])
  })

  it('POST /blogs should return 401 if user unauthorized', async () => {
    await request(app).post('/blogs').auth(CREDENTIALS.LOGIN, 'wrong_pass').expect(401)
  })

  it('POST /blogs should return 400 errors if input model incorrent', async () => {
    const newBlog: BlogInputModel = {
      name: '',
      description: '',
      websiteUrl: '',
    }

    await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(400)
  })

  it('POST /blogs should return 201 if input model is correct, use GET to check creted blog', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postBlogResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(201)

    const getBlogByIdResponse = await request(app)
      .get(`/blogs/${postBlogResponse.body.id}`)
      .expect(200)

    expect(getBlogByIdResponse.body).toEqual({
      id: expect.any(String),
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    })
  })

  it('PUT /blogs/:id should return 401 if user unauthorized', async () => {
    await request(app)
      .put(`/blogs/some_id`)
      .auth(CREDENTIALS.LOGIN, 'wrong_pass')
      .send({})
      .expect(401)
  })

  it('PUT /blogs/:id should return 404 if blog not found', async () => {
    const blogUpdate: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    await request(app)
      .put('/blogs/not_exists_id')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(blogUpdate)
      .expect(404)
  })

  it('PUT /blogs/:id should return 400 if input model incorrect, use POST', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(201)

    await request(app)
      .put(`/blogs/${postResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send({
        ...newBlog,
        websiteUrl: '',
      })
      .expect(400)
  })

  it('PUT /blogs/:id should return 204 if input model correct, use POST', async () => {
    const newBlog: BlogInputModel = {
      name: 'name',
      description: 'description',
      websiteUrl: 'https://websiteurl.com',
    }

    const postResponse = await request(app)
      .post('/blogs')
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(201)

    await request(app)
      .put(`/blogs/${postResponse.body.id}`)
      .auth(CREDENTIALS.LOGIN, CREDENTIALS.PASSWORD)
      .send(newBlog)
      .expect(204)
  })
})
