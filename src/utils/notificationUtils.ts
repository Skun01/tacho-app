import type { Notification } from '@/types/notification'
import { NOTIFICATION_COPY } from '@/constants/notification'

/** Hiển thị thời gian tương đối: "vừa xong", "3 phút trước"... */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return NOTIFICATION_COPY.justNow
  if (minutes < 60) return NOTIFICATION_COPY.minutesAgo(minutes)
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return NOTIFICATION_COPY.hoursAgo(hours)
  return NOTIFICATION_COPY.daysAgo(Math.floor(hours / 24))
}

/** Trả về đường dẫn để navigate khi click vào notification */
export function getNotifDestination(n: Notification): string {
  switch (n.type) {
    case 'review_reminder':
    case 'streak_warning':
      return '/dashboard'
    case 'milestone':
      return '/profile'
    case 'card_burned':
      return n.data?.cardId ? `/card/${n.data.cardId}` : '/dashboard'
    case 'comment_reply':
    case 'comment_like':
      return n.data?.cardId ? `/card/${n.data.cardId}` : '/dashboard'
    case 'deck_cloned':
      return n.data?.deckId ? `/deck/${n.data.deckId}` : '/library'
    case 'system':
      return '/library'
  }
}
