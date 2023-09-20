import {app} from '../../src/app'
import request from 'supertest'
import {Video} from '../../src/types/videos'

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
    const expectedCreatedVideo: Video = {
      title: 'title',
      author: 'author',
      id: expect.any(Number),
      availableResolutions: ['P240'],
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      minAgeRestriction: null,
      canBeDownloaded: false,
    }

    const {body: postResponseBody} = await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(201)

    expect(postResponseBody).toEqual(expectedCreatedVideo)

    const {body: getResponseBody} = await request(app).get('/videos').expect(200)

    expect(getResponseBody).toEqual([expectedCreatedVideo])
  })

  it('PUT /videos/:id should return 404 if no such video, using POST first to create', async () => {
    await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(201)

    await request(app).put('/videos/123123').expect(404)
  })

  it('PUT /videos/:id should return 400 if input data incorrect, using POST first to create', async () => {
    const incorrectUpdateData: Omit<Video, 'author' | 'id'> = {
      title: 'title',
      availableResolutions: ['P240'],
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      minAgeRestriction: null,
      canBeDownloaded: false,
    }
    const {
      body: {id},
    } = await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(201)

    await request(app).put(`/videos/${id}`).send(incorrectUpdateData).expect(400)
  })

  it('PUT /videos/:id should return 204 if input data correct, using POST first to create', async () => {
    const {body: postResponseBody} = await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(201)

    const {body: putResponseBody} = await request(app)
      .put(`/videos/${postResponseBody.id}`)
      .send({
        ...postResponseBody,
        title: 'new title',
        author: 'new author',
        minAgeRestriction: 15,
      })
      .expect(204)
  })
})
