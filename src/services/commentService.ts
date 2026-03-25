import type { Comment, CommentPage, Reply } from '@/types/comment'
import { MOCK_COMMENTS } from '@/mocks/comments'

const PAGE_SIZE = 5

// In-memory store for mock session mutations
let _store: Comment[] = structuredClone(MOCK_COMMENTS)

function reset() {
  _store = structuredClone(MOCK_COMMENTS)
}
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__resetComments = reset
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function getComments(
  cardId: string,
  page: number,
  pageSize = PAGE_SIZE,
): Promise<CommentPage> {
  await delay()
  const all = _store.filter((c) => c.cardId === cardId)
  const start = (page - 1) * pageSize
  const slice = all.slice(start, start + pageSize)
  return {
    comments: structuredClone(slice),
    total: all.length,
    page,
    hasMore: start + pageSize < all.length,
  }
}

export async function postComment(cardId: string, text: string): Promise<Comment> {
  await delay(200)
  const newComment: Comment = {
    id: `cm-${cardId}-${Date.now()}`,
    cardId,
    authorName: 'Bạn',
    text,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    likedByMe: false,
    replies: [],
    replyCount: 0,
  }
  _store.unshift(newComment)
  return structuredClone(newComment)
}

export async function toggleLikeComment(commentId: string): Promise<void> {
  await delay(100)
  const c = _store.find((x) => x.id === commentId)
  if (!c) return
  c.likedByMe = !c.likedByMe
  c.likeCount += c.likedByMe ? 1 : -1
}

export async function postReply(commentId: string, text: string): Promise<Reply> {
  await delay(200)
  const c = _store.find((x) => x.id === commentId)
  const newReply: Reply = {
    id: `rp-${commentId}-${Date.now()}`,
    commentId,
    authorName: 'Bạn',
    text,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    likedByMe: false,
  }
  if (c) {
    c.replies.push(newReply)
    c.replyCount = c.replies.length
  }
  return structuredClone(newReply)
}

export async function toggleLikeReply(commentId: string, replyId: string): Promise<void> {
  await delay(100)
  const c = _store.find((x) => x.id === commentId)
  const r = c?.replies.find((x) => x.id === replyId)
  if (!r) return
  r.likedByMe = !r.likedByMe
  r.likeCount += r.likedByMe ? 1 : -1
}
