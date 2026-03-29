import { useNavigate } from 'react-router'
import { XIcon } from '@phosphor-icons/react'
import type { Notification } from '@/types/notification'
import { NotifIcon } from '@/components/notifications/NotifIcon'
import { relativeTime, getNotifDestination } from '@/utils/notificationUtils'

interface NotifRowProps {
  notif: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * Một dòng notification trong dropdown panel (compact).
 * Click → navigate đến resource liên quan + đánh dấu đã đọc.
 * Hover → hiện nút xóa.
 */
export function NotifRow({ notif, onRead, onDelete }: NotifRowProps) {
  const navigate = useNavigate()

  function handleClick() {
    onRead(notif.id)
    navigate(getNotifDestination(notif))
  }

  return (
    <div
      className={`group relative flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-surface-container-low ${
        !notif.isRead ? 'bg-primary/[0.03]' : ''
      }`}
      onClick={handleClick}
    >
      {/* Unread dot */}
      {!notif.isRead && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
      )}

      <NotifIcon type={notif.type} size="sm" />

      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${notif.isRead ? 'text-foreground/80' : 'font-semibold text-foreground'}`}>
          {notif.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {notif.body}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground/70">{relativeTime(notif.createdAt)}</p>
      </div>

      {/* Delete — visible on hover */}
      <button
        aria-label="Xóa thông báo"
        onClick={(e) => { e.stopPropagation(); onDelete(notif.id) }}
        className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-surface-container text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-foreground group-hover:flex"
      >
        <XIcon size={11} />
      </button>
    </div>
  )
}
