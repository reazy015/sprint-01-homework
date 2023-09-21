import express, {json} from 'express'
import {getVideosRouter} from './routes/videos'
import {getTestingRouter} from './routes/testing'

export const app = express()
const jsonBodyParser = express.json()

app.use(jsonBodyParser)
app.use('/videos', getVideosRouter())
app.use('/__testing__/all-data', getTestingRouter())
