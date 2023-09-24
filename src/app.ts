import express, {json} from 'express'
import {getVideosRouter} from './routes/video'
import {getTestingRouter} from './routes/testing'
import {getBlogsRouter} from './routes/blogs'
import {getPostsRouter} from './routes/posts'

export const app = express()
const jsonBodyParser = express.json()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.use(jsonBodyParser)
app.use('/videos', getVideosRouter())
app.use('/blogs', getBlogsRouter())
app.use('/posts', getPostsRouter())
app.use('/__testing__/all-data', getTestingRouter())
