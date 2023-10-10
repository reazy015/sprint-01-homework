import express from 'express'
import {getVideosRouter} from './routes/video'
import {getTestingRouter} from './routes/testing'
import {getBlogsRouter} from './routes/blogs'
import {getPostsRouter} from './routes/posts'
import {getUsersRouter} from './routes/users'
import {getAuthRouter} from './routes/auth'

export const app = express()
const jsonBodyParser = express.json()

app.use(jsonBodyParser)
app.use('/videos', getVideosRouter())
app.use('/blogs', getBlogsRouter())
app.use('/posts', getPostsRouter())
app.use('/users', getUsersRouter())
app.use('/auth', getAuthRouter())
app.use('/testing/all-data', getTestingRouter())
