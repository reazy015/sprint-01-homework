import express, {json} from 'express'
import {getVideosRouter} from './routes/video'
import {getTestingRouter} from './routes/testing'
import {getBlogsRouter} from './routes/blogs'

export const app = express()
const jsonBodyParser = express.json()

app.use(jsonBodyParser)
app.use('/videos', getVideosRouter())
app.use('/blogs', getBlogsRouter())
app.use('/__testing__/all-data', getTestingRouter())