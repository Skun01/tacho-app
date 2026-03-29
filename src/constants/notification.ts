/** Toàn bộ UI copy cho notification feature */
export const NOTIFICATION_COPY = {
  // ── Dropdown panel ──────────────────────────────────────────────
  panelTitle: 'Thông báo',
  markAllRead: 'Đánh dấu tất cả đã đọc',
  viewAll: 'Xem tất cả',

  // ── Full page (/notifications) ───────────────────────────────────
  pageTitle: 'Thông báo',
  unreadSubtitle: (n: number) => `${n} chưa đọc`,

  // ── Filter bar ───────────────────────────────────────────────────
  filterOptions: [
    { label: 'Tất cả',     value: 'all' },
    { label: 'Chưa đọc',  value: 'unread' },
    { label: 'Ôn tập',    value: 'review_reminder' },
    { label: 'Streak',    value: 'streak_warning' },
    { label: 'Thành tích', value: 'milestone' },
    { label: 'Xã hội',    value: 'comment_reply' },
    { label: 'Hệ thống',  value: 'system' },
  ] as const,

  // ── Type badge labels ────────────────────────────────────────────
  typeLabels: {
    review_reminder: 'Ôn tập',
    streak_warning:  'Streak',
    milestone:       'Thành tích',
    card_burned:     'Thành tích',
    comment_reply:   'Xã hội',
    comment_like:    'Xã hội',
    deck_cloned:     'Xã hội',
    system:          'Hệ thống',
  } as const,

  // ── Empty states ─────────────────────────────────────────────────
  empty: 'Bạn chưa có thông báo nào.',   // dropdown panel
  emptyState: {
    emptyTitle: 'Bạn chưa có thông báo nào',
    emptyHint: 'Khi có hoạt động mới, chúng sẽ xuất hiện ở đây.',
    filteredTitle: 'Không có thông báo nào trong mục này',
    filteredHint: 'Thử chọn bộ lọc khác.',
  },

  // ── Relative time ────────────────────────────────────────────────
  justNow: 'Vừa xong',
  minutesAgo: (n: number) => `${n} phút trước`,
  hoursAgo:   (n: number) => `${n} giờ trước`,
  daysAgo:    (n: number) => `${n} ngày trước`,

  // ── Actions ──────────────────────────────────────────────────────
  deleteAriaLabel: 'Xóa thông báo',
  backAriaLabel: 'Quay lại',
  markAllReadBtn: 'Đánh dấu tất cả đã đọc',
} as const

export type NotifFilterValue =
  (typeof NOTIFICATION_COPY.filterOptions)[number]['value']
