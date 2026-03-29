import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { CheckIcon, FunnelIcon, ArrowLeftIcon } from '@phosphor-icons/react'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { FooterSection } from '@/components/home/FooterSection'
import { NotifCard } from '@/components/notifications/NotifCard'
import { NotifEmptyState } from '@/components/notifications/NotifEmptyState'
import { useNotifications } from '@/hooks/useNotifications'
import { NOTIFICATION_COPY, type NotifFilterValue } from '@/constants/notification'

const C = NOTIFICATION_COPY

// Types defined in constants to avoid hardcoding values inline
type FilterOption = (typeof C.filterOptions)[number]

/** Nhóm các notification type để ghép vào một filter bucket */
const SOCIAL_TYPES = ['comment_reply', 'comment_like', 'deck_cloned']
const ACHIEVEMENT_TYPES = ['milestone', 'card_burned']

function matchFilter(type: string, filter: NotifFilterValue): boolean {
  if (filter === 'all') return true
  if (filter === 'comment_reply') return SOCIAL_TYPES.includes(type)
  if (filter === 'milestone') return ACHIEVEMENT_TYPES.includes(type)
  return type === filter
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotifications()
  const [activeFilter, setActiveFilter] = useState<NotifFilterValue>('all')

  const filtered = notifications.filter((n) =>
    activeFilter === 'unread'
      ? !n.isRead
      : matchFilter(n.type, activeFilter)
  )

  return (
    <div className="min-h-screen bg-surface-container-low">
      <DashboardNavbar />

      <main>
        <div className="mx-auto max-w-2xl px-6 py-8">

          {/* Page header */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label={C.backAriaLabel}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-container hover:text-foreground"
            >
              <ArrowLeftIcon size={18} />
            </button>

            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{C.pageTitle}</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{C.unreadSubtitle(unreadCount)}</p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-xl bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <CheckIcon size={12} weight="bold" />
                {C.markAllReadBtn}
              </button>
            )}
          </div>

          {/* Filter bar */}
          <div className="mb-5 flex items-center gap-1 overflow-x-auto pb-1">
            <FunnelIcon size={14} className="mr-1 shrink-0 text-muted-foreground" />
            {C.filterOptions.map((opt: FilterOption) => (
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

          {/* Notification list */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <NotifEmptyState filtered={activeFilter !== 'all' && activeFilter !== 'unread'} />
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((n) => (
                  <NotifCard
                    key={n.id}
                    notif={n}
                    onRead={markRead}
                    onDelete={remove}
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
