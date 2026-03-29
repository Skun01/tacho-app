import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { XIcon } from '@phosphor-icons/react'
import type { Notification, NotificationType } from '@/types/notification'
import { NotifIcon } from '@/components/notifications/NotifIcon'
import { relativeTime, getNotifDestination } from '@/utils/notificationUtils'
import { NOTIFICATION_COPY } from '@/constants/notification'

const TYPE_LABEL: Record<NotificationType, string> = {
  review_reminder: NOTIFICATION_COPY.typeLabels.review_reminder,
  streak_warning:  NOTIFICATION_COPY.typeLabels.streak_warning,
  milestone:       NOTIFICATION_COPY.typeLabels.milestone,
  card_burned:     NOTIFICATION_COPY.typeLabels.card_burned,
  comment_reply:   NOTIFICATION_COPY.typeLabels.comment_reply,
  comment_like:    NOTIFICATION_COPY.typeLabels.comment_like,
  deck_cloned:     NOTIFICATION_COPY.typeLabels.deck_cloned,
  system:          NOTIFICATION_COPY.typeLabels.system,
}

interface NotifCardProps {
  notif: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * Card đầy đủ dùng trong trang /notifications.
 * Hiển thị loại (badge), tiêu đề, body, thời gian.
 * Click → navigate + đánh dấu đã đọc.
 */
export function NotifCard({ notif, onRead, onDelete }: NotifCardProps) {
  const navigate = useNavigate()

  function handleClick() {
    onRead(notif.id)
    navigate(getNotifDestination(notif))
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group relative flex gap-4 rounded-2xl p-4 cursor-pointer transition-colors hover:bg-surface-container-low ${
        !notif.isRead ? 'bg-primary/[0.04] ring-1 ring-primary/10' : 'bg-background'
      }`}
      onClick={handleClick}
    >
      {/* Unread dot (top-right) */}
      {!notif.isRead && (
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />
      )}

      <NotifIcon type={notif.type} size="md" />

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            {TYPE_LABEL[notif.type]}
          </span>
          <span className="text-[11px] text-muted-foreground/70">{relativeTime(notif.createdAt)}</span>
        </div>
        <p className={`text-sm leading-snug ${notif.isRead ? 'text-foreground/80' : 'font-semibold text-foreground'}`}>
          {notif.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {notif.body}
        </p>
      </div>

      {/* Delete — visible on hover */}
      <button
        aria-label="Xóa thông báo"
        onClick={(e) => { e.stopPropagation(); onDelete(notif.id) }}
        className="absolute right-4 top-4 hidden h-6 w-6 items-center justify-center rounded-full bg-surface-container text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-foreground group-hover:flex"
      >
        <XIcon size={12} />
      </button>
    </motion.div>
  )
}
