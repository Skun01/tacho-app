import { useState } from 'react'
import type { Notification } from '@/types/notification'
import { MOCK_NOTIFICATIONS } from '@/mocks/notifications'

/**
 * Shared state cho notification feature.
 * Cả NotificationPanel (dropdown) và NotificationsPage đều dùng hook này.
 *
 * TODO khi có backend:
 *  - Thay initial state bằng GET /notifications
 *  - Thêm polling GET /notifications/unread-count (mỗi 60s)
 *  - Gọi POST /notifications/:id/read và POST /notifications/read-all
 *  - Gọi DELETE /notifications/:id
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  function remove(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return { notifications, unreadCount, markRead, markAllRead, remove }
}
