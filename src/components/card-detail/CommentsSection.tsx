import { useEffect, useRef, useState } from 'react'
import { ChatCircleIcon } from '@phosphor-icons/react'
import { CommentList } from './CommentList'
import { COMMENTS_COPY } from '@/constants/comments'
import {
  getComments,
  postComment,
  toggleLikeComment,
  postReply,
  toggleLikeReply,
} from '@/services/commentService'
import type { Comment } from '@/types/comment'

interface Props {
  cardId: string
}

export function CommentsSection({ cardId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [composeFocused, setComposeFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setComments([])
    setPage(1)
    getComments(cardId, 1).then((res) => {
      if (cancelled) return
      setComments(res.comments)
      setTotal(res.total)
      setHasMore(res.hasMore)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [cardId])

  async function handleLoadMore() {
    setLoadingMore(true)
    const next = page + 1
    const res = await getComments(cardId, next)
    setComments((prev) => [...prev, ...res.comments])
    setTotal(res.total)
    setHasMore(res.hasMore)
    setPage(next)
    setLoadingMore(false)
  }

  async function handleSubmit() {
    if (!text.trim() || submitting) return
    setSubmitting(true)
    const newComment = await postComment(cardId, text.trim())
    setComments((prev) => [newComment, ...prev])
    setTotal((t) => t + 1)
    setText('')
    setSubmitting(false)
  }

  async function handleLike(commentId: string) {
    await toggleLikeComment(commentId)
    setComments((prev) =>
      prev.map((c) =>
        c.id !== commentId
          ? c
          : { ...c, likedByMe: !c.likedByMe, likeCount: c.likeCount + (c.likedByMe ? -1 : 1) },
      ),
    )
  }

  async function handleReplySubmit(commentId: string, replyText: string) {
    const newReply = await postReply(commentId, replyText)
    setComments((prev) =>
      prev.map((c) =>
        c.id !== commentId
          ? c
          : { ...c, replies: [...c.replies, newReply], replyCount: c.replyCount + 1 },
      ),
    )
  }

  async function handleLikeReply(commentId: string, replyId: string) {
    await toggleLikeReply(commentId, replyId)
    setComments((prev) =>
      prev.map((c) =>
        c.id !== commentId
          ? c
          : {
              ...c,
              replies: c.replies.map((r) =>
                r.id !== replyId
                  ? r
                  : { ...r, likedByMe: !r.likedByMe, likeCount: r.likeCount + (r.likedByMe ? -1 : 1) },
              ),
            },
      ),
    )
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <ChatCircleIcon size={14} className="text-muted-foreground" />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {COMMENTS_COPY.sectionTitle}
        </h2>
        {total > 0 && (
          <span className="rounded-full bg-surface-container px-2 py-0.5 text-[11px] font-semibold text-secondary">
            {total}
          </span>
        )}
      </div>

      {/* Compose */}
      <div className="mb-6 flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          B
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div
            className={`rounded-2xl bg-background transition-shadow ${
              composeFocused
                ? 'shadow-[0_2px_12px_0_rgba(29,28,19,0.10)]'
                : 'shadow-[0_1px_4px_0_rgba(29,28,19,0.07)]'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={COMMENTS_COPY.placeholder}
              rows={composeFocused ? 3 : 1}
              className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
              onFocus={() => setComposeFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
                if (e.key === 'Escape') { setComposeFocused(false); setText('') }
              }}
            />
            {composeFocused && (
              <div className="flex items-center justify-end gap-2 border-t border-[#1d1c13]/06 px-3 py-2">
                <button
                  onClick={() => { setComposeFocused(false); setText('') }}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface-container"
                >
                  {COMMENTS_COPY.replyCancel}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim() || submitting}
                  className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-primary-container disabled:opacity-40"
                >
                  {submitting ? COMMENTS_COPY.submitting : COMMENTS_COPY.submitBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{COMMENTS_COPY.loading}</p>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{COMMENTS_COPY.noComments}</p>
      ) : (
        <CommentList
          comments={comments}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
          onLike={handleLike}
          onReplySubmit={handleReplySubmit}
          onLikeReply={handleLikeReply}
        />
      )}
    </section>
  )
}
