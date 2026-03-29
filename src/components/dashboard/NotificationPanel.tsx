import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BellIcon,
  BellRingingIcon,
  CheckIcon,
  ClockIcon,
  ChatCircleIcon,
  HeartIcon,
  TrophyIcon,
  FireIcon,
  CopyIcon,
  SpeakerHighIcon,
  XIcon,
} from '@phosphor-icons/react'
import type { Notification, NotificationType } from '@/types/notification'
import { MOCK_NOTIFICATIONS, NOTIFICATION_COPY } from '@/constants/notification'

// ─── Icon per notification type ───────────────────────────────────────────────
function NotifIcon({ type }: { type: NotificationType }) {
  const base = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full'
  switch (type) {
    case 'review_reminder':
      return <span className={`${base} bg-primary/10`}><ClockIcon size={15} weight="fill" className="text-primary" /></span>
    case 'streak_warning':
      return <span className={`${base} bg-orange-100`}><FireIcon size={15} weight="fill" className="text-orange-500" /></span>
    case 'milestone':
      return <span className={`${base} bg-emerald-100`}><TrophyIcon size={15} weight="fill" className="text-emerald-600" /></span>
    case 'card_burned':
      return <span className={`${base} bg-amber-100`}><TrophyIcon size={15} weight="fill" className="text-amber-500" /></span>
    case 'comment_reply':
      return <span className={`${base} bg-blue-100`}><ChatCircleIcon size={15} weight="fill" className="text-blue-500" /></span>
    case 'comment_like':
      return <span className={`${base} bg-rose-100`}><HeartIcon size={15} weight="fill" className="text-rose-500" /></span>
    case 'deck_cloned':
      return <span className={`${base} bg-violet-100`}><CopyIcon size={15} weight="fill" className="text-violet-500" /></span>
    case 'system':
    default:
      return <span className={`${base} bg-surface-container`}><SpeakerHighIcon size={15} weight="fill" className="text-muted-foreground" /></span>
  }
}

// ─── Relative time label ──────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return NOTIFICATION_COPY.justNow
  if (minutes < 60) return NOTIFICATION_COPY.minutesAgo(minutes)
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return NOTIFICATION_COPY.hoursAgo(hours)
  return NOTIFICATION_COPY.daysAgo(Math.floor(hours / 24))
}

// ─── Navigate destination per type ───────────────────────────────────────────
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

// ─── Single notification row ──────────────────────────────────────────────────
function NotifRow({
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

      <NotifIcon type={notif.type} />

      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${notif.isRead ? 'text-foreground/80' : 'font-semibold text-foreground'}`}>
          {notif.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {notif.body}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground/70">{relativeTime(notif.createdAt)}</p>
      </div>

      {/* Delete button — visible on hover */}
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

// ─── Main component ───────────────────────────────────────────────────────────
export function NotificationPanel() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Bell trigger */}
      <button
        aria-label="Thông báo"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          open ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-surface-container hover:text-primary'
        }`}
      >
        {unreadCount > 0 ? (
          <BellRingingIcon size={18} weight="fill" />
        ) : (
          <BellIcon size={18} />
        )}

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-[22rem] overflow-hidden rounded-2xl bg-background shadow-[0_8px_40px_0_rgba(29,28,19,0.16)] ring-1 ring-[#1d1c13]/8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1d1c13]/8 px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                {NOTIFICATION_COPY.panelTitle}
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-100 px-1.5 text-[10px] font-bold text-rose-600">
                    {unreadCount}
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/8"
                >
                  <CheckIcon size={11} weight="bold" />
                  {NOTIFICATION_COPY.markAllRead}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-[#1d1c13]/6">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <BellIcon size={32} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{NOTIFICATION_COPY.empty}</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <NotifRow
                    key={n.id}
                    notif={n}
                    onRead={(id) => { handleMarkRead(id); setOpen(false) }}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-[#1d1c13]/8 p-2">
                <button
                  onClick={() => { setOpen(false); navigate('/notifications') }}
                  className="w-full rounded-xl py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/8"
                >
                  {NOTIFICATION_COPY.viewAll}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
