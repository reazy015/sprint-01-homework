import {WithId} from 'mongodb'

export interface CommentViewModel {
  id: string
  content: string
  commentatorInfo: CommentatorInfo
  createdAt: string
}

export interface CommentInputModel extends Omit<CommentViewModel, 'id'> {
  postId: string
}

interface CommentatorInfo {
  userId: string
  userLogin: string
}

export interface DbComment extends WithId<Omit<CommentViewModel, 'id'>> {
  postId: string
}
