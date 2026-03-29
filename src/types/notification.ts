export type NotificationType =
  | 'review_reminder'
  | 'streak_warning'
  | 'milestone'
  | 'card_burned'
  | 'comment_reply'
  | 'comment_like'
  | 'deck_cloned'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: string // ISO 8601
}

export interface NotificationSettings {
  reviewReminder: boolean
  streakWarning: boolean
  milestone: boolean
  social: boolean
  system: boolean
}
