import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BellIcon,
  CheckIcon,
  FunnelIcon,
  ClockIcon,
  ChatCircleIcon,
  HeartIcon,
  TrophyIcon,
  FireIcon,
  CopyIcon,
  SpeakerHighIcon,
  XIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { FooterSection } from '@/components/home/FooterSection'
import { MOCK_NOTIFICATIONS, NOTIFICATION_COPY } from '@/constants/notification'
import type { Notification, NotificationType } from '@/types/notification'

// ─── Constants ────────────────────────────────────────────────────────────────
const FILTER_OPTIONS: { label: string; value: 'all' | 'unread' | NotificationType }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chưa đọc', value: 'unread' },
  { label: 'Ôn tập', value: 'review_reminder' },
  { label: 'Streak', value: 'streak_warning' },
  { label: 'Thành tích', value: 'milestone' },
  { label: 'Xã hội', value: 'comment_reply' },
  { label: 'Hệ thống', value: 'system' },
]

const TYPE_LABEL: Record<NotificationType, string> = {
  review_reminder: 'Ôn tập',
  streak_warning: 'Streak',
  milestone: 'Thành tích',
  card_burned: 'Thành tích',
  comment_reply: 'Xã hội',
  comment_like: 'Xã hội',
  deck_cloned: 'Xã hội',
  system: 'Hệ thống',
}

// ─── Icon per type ────────────────────────────────────────────────────────────
function NotifIcon({ type, size = 'md' }: { type: NotificationType; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'h-10 w-10' : 'h-8 w-8'
  const iconSize = size === 'md' ? 18 : 15
  const base = `flex ${dim} shrink-0 items-center justify-center rounded-full`
  switch (type) {
    case 'review_reminder':
      return <span className={`${base} bg-primary/10`}><ClockIcon size={iconSize} weight="fill" className="text-primary" /></span>
    case 'streak_warning':
      return <span className={`${base} bg-orange-100`}><FireIcon size={iconSize} weight="fill" className="text-orange-500" /></span>
    case 'milestone':
      return <span className={`${base} bg-emerald-100`}><TrophyIcon size={iconSize} weight="fill" className="text-emerald-600" /></span>
    case 'card_burned':
      return <span className={`${base} bg-amber-100`}><TrophyIcon size={iconSize} weight="fill" className="text-amber-500" /></span>
    case 'comment_reply':
      return <span className={`${base} bg-blue-100`}><ChatCircleIcon size={iconSize} weight="fill" className="text-blue-500" /></span>
    case 'comment_like':
      return <span className={`${base} bg-rose-100`}><HeartIcon size={iconSize} weight="fill" className="text-rose-500" /></span>
    case 'deck_cloned':
      return <span className={`${base} bg-violet-100`}><CopyIcon size={iconSize} weight="fill" className="text-violet-500" /></span>
    case 'system':
    default:
      return <span className={`${base} bg-surface-container`}><SpeakerHighIcon size={iconSize} weight="fill" className="text-muted-foreground" /></span>
  }
}

// ─── Relative time ─────────────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return NOTIFICATION_COPY.justNow
  if (minutes < 60) return NOTIFICATION_COPY.minutesAgo(minutes)
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return NOTIFICATION_COPY.hoursAgo(hours)
  return NOTIFICATION_COPY.daysAgo(Math.floor(hours / 24))
}

// ─── Navigate destination ─────────────────────────────────────────────────────
function getDestination(n: Notification): string {
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

// ─── Notification card ─────────────────────────────────────────────────────────
function NotifCard({
  notif,
  onRead,
  onDelete,
}: {
  notif: Notification
  onRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const navigate = useNavigate()

  function handleClick() {
    onRead(notif.id)
    navigate(getDestination(notif))
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
      {/* Unread dot */}
      {!notif.isRead && (
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />
      )}

      <NotifIcon type={notif.type} />

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

      {/* Delete */}
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

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <BellIcon size={28} className="text-muted-foreground/50" />
      </div>
      <p className="text-base font-medium text-foreground">
        {filtered ? 'Không có thông báo nào trong mục này' : 'Bạn chưa có thông báo nào'}
      </p>
      <p className="text-sm text-muted-foreground">
        {filtered ? 'Thử chọn bộ lọc khác.' : 'Khi có hoạt động mới, chúng sẽ xuất hiện ở đây.'}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | NotificationType>('all')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !n.isRead
    // group social types under 'comment_reply' filter key
    if (activeFilter === 'comment_reply') return ['comment_reply', 'comment_like', 'deck_cloned'].includes(n.type)
    if (activeFilter === 'milestone') return ['milestone', 'card_burned'].includes(n.type)
    return n.type === activeFilter
  })

  function handleRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      <DashboardNavbar />
      <main>
        <div className="mx-auto max-w-2xl px-6 py-8">

          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-container hover:text-foreground"
            >
              <ArrowLeftIcon size={18} />
            </button>

            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Thông báo</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} chưa đọc</p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 rounded-xl bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <CheckIcon size={12} weight="bold" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Filter bar */}
          <div className="mb-5 flex items-center gap-1 overflow-x-auto pb-1">
            <FunnelIcon size={14} className="mr-1 shrink-0 text-muted-foreground" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === opt.value
                    ? 'bg-primary text-background'
                    : 'bg-surface-container text-muted-foreground hover:bg-surface-container-high hover:text-foreground'
                }`}
              >
                {opt.label}
                {opt.value === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState filtered={activeFilter !== 'all'} />
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((n) => (
                  <NotifCard
                    key={n.id}
                    notif={n}
                    onRead={handleRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
