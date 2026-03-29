import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { BellIcon, BellRingingIcon, CheckIcon } from '@phosphor-icons/react'
import { NotifRow } from '@/components/notifications/NotifRow'
import { useNotifications } from '@/hooks/useNotifications'
import { NOTIFICATION_COPY } from '@/constants/notification'

const C = NOTIFICATION_COPY

/**
 * Bell icon + dropdown panel trong DashboardNavbar.
 * State được quản lý qua useNotifications hook.
 */
export function NotificationPanel() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotifications()

  // Đóng khi click ngoài
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

  function handleRead(id: string) {
    markRead(id)
    setOpen(false)
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Bell trigger */}
      <button
        aria-label={C.panelTitle}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          open ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-surface-container hover:text-primary'
        }`}
      >
        {unreadCount > 0
          ? <BellRingingIcon size={18} weight="fill" />
          : <BellIcon size={18} />
        }
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-[22rem] overflow-hidden rounded-2xl bg-background shadow-[0_8px_40px_0_rgba(29,28,19,0.16)] ring-1 ring-[#1d1c13]/8"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between bg-surface-container-low/60 px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                {C.panelTitle}
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-100 px-1.5 text-[10px] font-bold text-rose-600">
                    {unreadCount}
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/8"
                >
                  <CheckIcon size={11} weight="bold" />
                  {C.markAllRead}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-[#1d1c13]/6">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <BellIcon size={32} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{C.empty}</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <NotifRow
                    key={n.id}
                    notif={n}
                    onRead={handleRead}
                    onDelete={remove}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="bg-surface-container-low/60 p-2">
                <button
                  onClick={() => { setOpen(false); navigate('/notifications') }}
                  className="w-full rounded-xl py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/8"
                >
                  {C.viewAll}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
