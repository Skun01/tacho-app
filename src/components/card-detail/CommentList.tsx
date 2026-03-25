import { SpinnerGapIcon } from '@phosphor-icons/react'
import { CommentItem } from './CommentItem'
import { COMMENTS_COPY } from '@/constants/comments'
import type { Comment } from '@/types/comment'

interface Props {
  comments: Comment[]
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  onLike: (commentId: string) => void
  onReplySubmit: (commentId: string, text: string) => Promise<void>
  onLikeReply: (commentId: string, replyId: string) => void
}

export function CommentList({
  comments,
  hasMore,
  loadingMore,
  onLoadMore,
  onLike,
  onReplySubmit,
  onLikeReply,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          onLike={onLike}
          onReplySubmit={onReplySubmit}
          onLikeReply={onLikeReply}
        />
      ))}

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#1d1c13]/10 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container disabled:opacity-50"
        >
          {loadingMore
            ? <><SpinnerGapIcon size={14} className="animate-spin" /> {COMMENTS_COPY.loading}</>
            : COMMENTS_COPY.loadMore}
        </button>
      )}
    </div>
  )
}
