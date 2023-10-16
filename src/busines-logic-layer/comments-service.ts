import {ObjectId} from 'mongodb'
import {commentsCommandRespository} from '../data-access-layer/command/comments-command-repository'
import {usersQueryRepository} from '../data-access-layer/query/users-query-repository'
import {db} from '../db/db'
import {CommentViewModel, DbComment} from '../types/comment'

const commentsCollection = db.collection<DbComment>('collection')

export const commentsService = {
  async createNewComment({
    userId,
    postId,
    content,
  }: {
    userId: string
    postId: string
    content: string
  }): Promise<string | null> {
    const createdAt = new Date().toISOString()

    const user = await usersQueryRepository.getSingleUserById(userId)

    const newComment: Omit<CommentViewModel, 'id'> & {postId: string} = {
      postId: postId,
      content: content,
      commentatorInfo: {
        userId,
        userLogin: user!.login,
      },
      createdAt: createdAt,
    }

    const insertedCommentId = await commentsCommandRespository.addNewComment(newComment)

    return insertedCommentId
  },
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const updated = await commentsCommandRespository.updateCommentById(id, content)

    return updated
  },
  async deleteCommentById(id: string): Promise<boolean> {
    const updated = await commentsCommandRespository.deleteCommentById(id)

    return updated
  },
}
