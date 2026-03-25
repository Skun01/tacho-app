export interface Reply {
  id: string
  commentId: string
  authorName: string
  authorAvatar?: string
  text: string
  createdAt: string       // ISO 8601
  likeCount: number
  likedByMe: boolean
}

export interface Comment {
  id: string
  cardId: string
  authorName: string
  authorAvatar?: string
  text: string
  createdAt: string       // ISO 8601
  likeCount: number
  likedByMe: boolean
  replies: Reply[]
  replyCount: number
}

export interface CommentPage {
  comments: Comment[]
  total: number
  page: number
  hasMore: boolean
}
