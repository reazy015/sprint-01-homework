import {NextFunction, Response} from 'express'
import {CustomRequest} from '../types/common'
import {db} from '../db/db'
import {DbComment} from '../types/comment'
import {ObjectId} from 'mongodb'
import {HTTP_STATUSES} from '../utils/constants'

const commentsCollection = db.collection<DbComment>('comments')

export const commentBelongsToMiddleware = async (
  req: CustomRequest<{content: string}, {id: string}>,
  res: Response,
  next: NextFunction,
) => {
  const comment = await commentsCollection.findOne({_id: new ObjectId(req.params.id)})

  if (!comment) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    return
  }

  if (comment.commentatorInfo.userId !== req.context.userId) {
    res.sendStatus(HTTP_STATUSES.FORBIDDEN)
    return
  }

  next()
}
