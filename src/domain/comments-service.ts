import {commentsCommandRespository} from '../repositories/command/comments-command-repository'
import {usersQueryRepository} from '../repositories/query/users-query-repository'
import {CommentViewModel} from '../types/comment'

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
