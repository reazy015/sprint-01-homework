import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {CommentViewModel, DbComment} from '../../types/comment'

const commentsCollection = db.collection<DbComment>('comments')
export const commentsQueryRepository = {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const comment = await commentsCollection.findOne({_id: new ObjectId(id)})

    if (!comment) {
      return null
    }

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
    }
  },
}
