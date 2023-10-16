import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {CommentInputModel, CommentViewModel} from '../../types/comment'

const commentsCollection = db.collection<CommentInputModel>('comments')

export const commentsCommandRespository = {
  async addNewComment(newComment: CommentInputModel): Promise<string | null> {
    const insertedComment = await commentsCollection.insertOne(newComment)

    return insertedComment.acknowledged ? insertedComment.insertedId.toString() : null
  },
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const updatedComment = await commentsCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: {content: content}},
    )

    return updatedComment.acknowledged
  },
  async deleteCommentById(id: string): Promise<boolean> {
    const deleted = await commentsCollection.deleteOne({_id: new ObjectId(id)})

    return deleted.acknowledged
  },
  async deleteAllComments(): Promise<boolean> {
    const deleted = await commentsCollection.deleteMany()

    return deleted.acknowledged
  },
}
