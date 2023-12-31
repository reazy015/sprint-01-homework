import {app} from '../../src/app'
import request from 'supertest'
import {Video} from '../../src/types/video'
import {HTTP_STATUSES} from '../../src/utils/constants'

describe('/videos', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data')
  })

  it('GET /videos should return 200 and empty array', async () => {
    await request(app).get('/videos').expect(HTTP_STATUSES.OK, [])
  })

  it('GET /videos/:id should return video by id, if found, use POST to create video', async () => {
    const {body: postResponse} = await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(HTTP_STATUSES.CREATED)

    const createdVideoId = postResponse.id

    const {body: getResponse} = await request(app)
      .get(`/videos/${createdVideoId}`)
      .expect(HTTP_STATUSES.OK)

    const expectedCreatedVideo: Video = {
      title: 'title',
      author: 'author',
      id: getResponse.id,
      availableResolutions: ['P240'],
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      minAgeRestriction: null,
      canBeDownloaded: false,
    }

    expect(getResponse).toEqual(expectedCreatedVideo)
  })

  it('GET /videos/:id should return error if ID param is incorrect', async () => {
    await request(app).get('/videos/wrong-123').expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('POST /videos should not create video with incorrect data', async () => {
    await request(app).post('/videos').send({title: 'test_title'}).expect(HTTP_STATUSES.BAD_REQUEST)
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
      .expect(HTTP_STATUSES.CREATED)

    expect(postResponseBody).toEqual(expectedCreatedVideo)

    const {body: getResponseBody} = await request(app)
      .get(`/videos/${postResponseBody.id}`)
      .expect(HTTP_STATUSES.OK)

    expect(getResponseBody).toEqual(expectedCreatedVideo)
  })

  it('PUT /videos/:id should return 404 if no such video, but the input data is correct, using POST first to create', async () => {
    await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .put('/videos/123123')
      .send({
        title: 'title',
        author: 'author',
        availableResolutions: ['P240'],
        canBeDownloaded: true,
        publicationDate: 'string',
      })
      .expect(HTTP_STATUSES.NOT_FOUND)
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
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .put(`/videos/${id}`)
      .send(incorrectUpdateData)
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  it('PUT /videos/:id should return 204 if input data correct, using POST first to create', async () => {
    const {body: postResponseBody} = await request(app)
      .post('/videos')
      .send({title: 'title', author: 'author', availableResolutions: ['P240']})
      .expect(HTTP_STATUSES.CREATED)

    await request(app)
      .put(`/videos/${postResponseBody.id}`)
      .send({
        ...postResponseBody,
        title: 'new title',
        author: 'new author',
        minAgeRestriction: 15,
      })
      .expect(HTTP_STATUSES.NO_CONTENT)
  })
})
