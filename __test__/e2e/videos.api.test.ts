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

  it('POST /videos should create new video, use GET /videos/:id to check created video', async () => {
    const postResponse = await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(201)

    const createdVideo = postResponse.body

    expect(createdVideo).toEqual({
      title: 'title',
      author: 'author',
      id: expect.any(Number),
      availableResolutions: ['P240'],
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      minAgeRestriction: null,
      canBeDownloaded: false,
    })

    const getResponse = await request(app).get('/videos').expect(200)

    expect(getResponse.body).toEqual([
      {
        title: 'title',
        author: 'author',
        id: expect.any(Number),
        availableResolutions: ['P240'],
        createdAt: expect.any(String),
        publicationDate: expect.any(String),
        minAgeRestriction: null,
        canBeDownloaded: false,
      },
    ])
  })
})
