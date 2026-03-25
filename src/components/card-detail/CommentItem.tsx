import { useState } from 'react'
import { HeartIcon, ArrowBendUpLeftIcon } from '@phosphor-icons/react'
import { COMMENTS_COPY } from '@/constants/comments'
import type { Comment, Reply } from '@/types/comment'

interface Props {
  comment: Comment
  onLike: (commentId: string) => void
  onReplySubmit: (commentId: string, text: string) => Promise<void>
  onLikeReply: (commentId: string, replyId: string) => void
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return 'vừa xong'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} phút trước`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} giờ trước`
  if (diff < 2_592_000_000) return `${Math.floor(diff / 86_400_000)} ngày trước`
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs'
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`${dim} ${color} flex shrink-0 items-center justify-center rounded-full font-bold`}>
      {getInitials(name)}
    </div>
  )
}

function ReplyItem({
  reply,
  onLike,
}: {
  reply: Reply
  onLike: () => void
}) {
  return (
    <div className="flex gap-2">
      <Avatar name={reply.authorName} size="sm" />
      <div className="flex-1">
        <div className="rounded-2xl bg-background px-3 py-2 shadow-[0_1px_4px_0_rgba(29,28,19,0.07)]">
          <p className="mb-0.5 text-xs font-semibold text-foreground">{reply.authorName}</p>
          <p className="text-sm leading-relaxed text-foreground">{reply.text}</p>
        </div>
        <div className="mt-1 flex items-center gap-3 pl-1">
          <span className="text-[11px] text-muted-foreground/50">{formatRelative(reply.createdAt)}</span>
          <button
            onClick={onLike}
            className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
              reply.likedByMe ? 'text-rose-500' : 'text-muted-foreground/50 hover:text-rose-400'
            }`}
          >
            <HeartIcon size={11} weight={reply.likedByMe ? 'fill' : 'regular'} />
            <span>{reply.likeCount > 0 ? COMMENTS_COPY.likeCount(reply.likeCount) : COMMENTS_COPY.likeBtn}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function CommentItem({ comment, onLike, onReplySubmit, onLikeReply }: Props) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleReply() {
    if (!replyText.trim() || submitting) return
    setSubmitting(true)
    await onReplySubmit(comment.id, replyText.trim())
    setReplyText('')
    setSubmitting(false)
    setShowReplies(true)
    setShowReplyInput(false)
  }

  return (
    <div className="flex gap-3">
      <Avatar name={comment.authorName} />
      <div className="flex-1">
        {/* Bubble */}
        <div className="rounded-2xl bg-background px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.08)]">
          <p className="mb-1 text-xs font-semibold text-foreground">{comment.authorName}</p>
          <p className="text-sm leading-relaxed text-foreground">{comment.text}</p>
        </div>

        {/* Meta row */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 pl-1">
          <span className="text-[11px] text-muted-foreground/50">{formatRelative(comment.createdAt)}</span>

          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
              comment.likedByMe ? 'text-rose-500' : 'text-muted-foreground/50 hover:text-rose-400'
            }`}
          >
            <HeartIcon size={11} weight={comment.likedByMe ? 'fill' : 'regular'} />
            <span>{comment.likeCount > 0 ? COMMENTS_COPY.likeCount(comment.likeCount) : COMMENTS_COPY.likeBtn}</span>
          </button>

          <button
            onClick={() => { setShowReplyInput((v) => !v); if (!showReplies) setShowReplies(true) }}
            className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/50 transition-colors hover:text-primary"
          >
            <ArrowBendUpLeftIcon size={11} />
            {COMMENTS_COPY.replyBtn}
          </button>

          {comment.replyCount > 0 && (
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="text-[11px] font-semibold text-primary/60 transition-colors hover:text-primary"
            >
              {showReplies
                ? COMMENTS_COPY.hideReplies
                : COMMENTS_COPY.repliesCount(comment.replyCount)}
            </button>
          )}
        </div>

        {/* Replies list — indented by avatar width (ml-11) */}
        {showReplies && comment.replies.length > 0 && (
          <div className="ml-1 mt-2.5 flex flex-col gap-2">
            {comment.replies.map((r) => (
              <ReplyItem
                key={r.id}
                reply={r}
                onLike={() => onLikeReply(comment.id, r.id)}
              />
            ))}
          </div>
        )}

        {/* Reply input */}
        {showReplyInput && (
          <div className="ml-1 mt-2 flex gap-2">
            <Avatar name="Bạn" size="sm" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="rounded-2xl bg-background shadow-[0_1px_6px_0_rgba(29,28,19,0.08)]">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={COMMENTS_COPY.replyPlaceholder}
                  rows={2}
                  autoFocus
                  className="w-full resize-none rounded-2xl bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply()
                    if (e.key === 'Escape') { setShowReplyInput(false); setReplyText('') }
                  }}
                />
                <div className="flex justify-end gap-2 border-t border-[#1d1c13]/06 px-3 py-2">
                  <button
                    onClick={() => { setShowReplyInput(false); setReplyText('') }}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface-container"
                  >
                    {COMMENTS_COPY.replyCancel}
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || submitting}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-primary-container disabled:opacity-40"
                  >
                    {COMMENTS_COPY.replySubmit}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
