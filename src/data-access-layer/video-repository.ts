import {Video} from '../types/videos'

type VideoId = number
let videosDb: Record<VideoId, Video> = []

export const videoRepositry = {
  getVideoById(id: number) {
    return videosDb[id]
  },
  getAllVideos() {
    return Object.values(videosDb)
  },
  addVideo(video: Omit<Video, 'id' | 'createdAt' | 'publicationDate'>) {
    const id = +new Date()
    const createdAtDate = new Date()
    let publicationDate = new Date(
      new Date(createdAtDate).setDate(createdAtDate.getDate() + 1),
    ).toISOString()

    videosDb[id] = {
      ...video,
      id,
      createdAt: createdAtDate.toISOString(),
      publicationDate,
    }

    return id
  },
  updateVideo(id: number, video: Video) {
    videosDb[id] = {
      ...video,
    }

    return true
  },
  deleteVideo(id: number) {
    if (!(id in videosDb)) {
      return false
    }

    delete videosDb[id]

    return true
  },
  deleteAllVideos() {
    videosDb = {}
  },
}
