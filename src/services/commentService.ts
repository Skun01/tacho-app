import type { Comment, CommentPage, Reply } from '@/types/comment'
import type { ApiResponse } from '@/types/api'
import api from './api'

const PAGE_SIZE = 5

function ensureSuccess<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message ?? 'Common_500')
  }

  return response.data
}

export async function getComments(
  cardId: string,
  page: number,
  pageSize = PAGE_SIZE,
): Promise<CommentPage> {
  const { data } = await api.get<ApiResponse<CommentPage>>(`/cards/${cardId}/comments`, {
    params: { page, pageSize },
  })

  return ensureSuccess(data)
}

export async function postComment(cardId: string, text: string): Promise<Comment> {
  const { data } = await api.post<ApiResponse<Comment>>(`/cards/${cardId}/comments`, { text })
  return ensureSuccess(data)
}

export async function toggleLikeComment(cardId: string, commentId: string): Promise<void> {
  const { data } = await api.patch<ApiResponse<object>>(
    `/cards/${cardId}/comments/${commentId}/like`,
  )

  ensureSuccess(data)
}

export async function postReply(cardId: string, commentId: string, text: string): Promise<Reply> {
  const { data } = await api.post<ApiResponse<Reply>>(
    `/cards/${cardId}/comments/${commentId}/replies`,
    { text },
  )

  return ensureSuccess(data)
}

export async function toggleLikeReply(cardId: string, commentId: string, replyId: string): Promise<void> {
  const { data } = await api.patch<ApiResponse<object>>(
    `/cards/${cardId}/comments/${commentId}/replies/${replyId}/like`,
  )

  ensureSuccess(data)
}
