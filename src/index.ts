import express from 'express'

export const app = express()
const PORT = process.env.PORT || 3003
const jsonBodyParser = express.json()

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

type AgeRange = Range<1, 18>
const RESOLUTIONS = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const
type Resolutions = (typeof RESOLUTIONS)[number]
const RESOLUTIONS_STRING = RESOLUTIONS.join(', ')

const isAvailableResolutionsCorrect = (availableResolutions: Resolutions[]) => {
  return availableResolutions.every((res) => RESOLUTIONS.includes(res))
}

interface Video {
  id: number
  title: string
  author: string
  canBeDownloaded: boolean
  minAgeRestriction: AgeRange | null
  createdAt: string
  publicationDate: string
  availableResolutions: Resolutions
}

let videoList: Video[] = []

app.use(jsonBodyParser)

app.get('/videos', (_req, res) => {
  res.status(200).json(videoList)
})

app.get('/videos/:id', (req, res) => {
  const id = req.params.id

  const found = videoList.find((video) => video.id === +id)

  if (!found) {
    res.sendStatus(404)
    return
  }

  res.status(200).json(found)
})

app.post('/videos', (req, res) => {
  const {title, author, availableResolutions} = req.body
  const errorsMessages = []

  if (!title || title.length > 40) {
    errorsMessages.push({
      message: 'title is required, max length 40',
      field: 'title',
    })
  }

  if (!author || author.length > 20) {
    errorsMessages.push({
      message: 'author is required, max length 20',
      field: 'author',
    })
  }

  if (!availableResolutions || !availableResolutions.length) {
    errorsMessages.push({
      message: 'availableResolutions is required',
      field: 'availableResolutions',
    })
  }

  if (
    availableResolutions &&
    availableResolutions.length &&
    !isAvailableResolutionsCorrect(availableResolutions)
  ) {
    errorsMessages.push({
      message: `availableResolutions has incorrect values, correct types are: ${RESOLUTIONS_STRING}`,
      field: 'availableResolutions',
    })
  }

  if (errorsMessages.length) {
    res.status(400).json({errorsMessages})
    return
  }

  const id = +new Date()
  const createdAtDate = new Date()
  let publicationDate = new Date(
    new Date(createdAtDate).setDate(createdAtDate.getDate() + 1),
  ).toISOString()
  const created = {
    title,
    author,
    id,
    availableResolutions,
    createdAt: createdAtDate.toISOString(),
    publicationDate,
    minAgeRestriction: null,
    canBeDownloaded: false,
  }

  videoList.push(created)
  res.status(201).json(created)
})

app.delete('/videos/:id', (req, res) => {
  const id = req.params.id

  const found = videoList.find((video) => video.id === +id)

  if (!found) {
    res.status(404).json({
      errorsMessages: [
        {
          message: 'Not found',
          field: 'Id',
        },
      ],
    })
    return
  }

  const filtered = videoList.filter((video) => video.id !== +id)
  videoList = [...filtered]
  res.status(204).json({
    deleted: true,
  })
})

app.delete('/testing/all-data', (_req, res) => {
  videoList = []
  res.status(204).json({
    deleted: true,
  })
})

app.put('/videos/:id', (req, res) => {
  const updates = req.body
  const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} =
    updates
  const id = req.params.id

  const found = videoList.find((video) => video.id === +id)

  if (!found) {
    res.sendStatus(404)
    return
  }

  const errorsMessages = []

  if (typeof canBeDownloaded !== 'boolean') {
    errorsMessages.push({
      message: 'can be only boolean type',
      field: 'canBeDownloaded',
    })
  }

  if (!title || title.length > 40) {
    errorsMessages.push({
      message: 'title is required, max length 40',
      field: 'title',
    })
  }

  if (!author || author.length > 20) {
    errorsMessages.push({
      message: 'author is required, max length 20',
      field: 'author',
    })
  }

  if (!availableResolutions || !availableResolutions.length) {
    errorsMessages.push({
      message: 'availableResolutions is required',
      field: 'availableResolutions',
    })
  }

  if (minAgeRestriction > 18 || minAgeRestriction < 1) {
    errorsMessages.push({
      message: 'minAgeRestriction is incorrect, must be in range 1-18',
      field: 'minAgeRestriction',
    })
  }

  if (typeof publicationDate !== 'string') {
    errorsMessages.push({
      message: 'publicationDate is incorrect, must be a date string in ISO format',
      field: 'publicationDate',
    })
  }

  if (
    availableResolutions &&
    availableResolutions.length &&
    !isAvailableResolutionsCorrect(availableResolutions)
  ) {
    errorsMessages.push({
      message: `availableResolutions has incorrect values, correct types are: ${RESOLUTIONS_STRING}`,
      field: 'availableResolutions',
    })
  }

  if (errorsMessages.length) {
    res.status(400).json({errorsMessages})
    return
  }

  const updated = {...found, ...updates}

  const filteredVideoList = videoList.filter((video) => video.id !== +id)
  videoList = [...filteredVideoList, updated]
  res.sendStatus(204)
})

app.listen(PORT, () => `Server started on localhost:${PORT}`)
