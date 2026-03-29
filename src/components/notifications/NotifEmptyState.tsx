import { BellIcon } from '@phosphor-icons/react'
import { NOTIFICATION_COPY } from '@/constants/notification'

interface NotifEmptyStateProps {
  /** true nếu người dùng đang lọc theo 1 category cụ thể */
  filtered?: boolean
}

/** Empty state cho trang /notifications */
export function NotifEmptyState({ filtered = false }: NotifEmptyStateProps) {
  const C = NOTIFICATION_COPY.emptyState
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <BellIcon size={28} className="text-muted-foreground/50" />
      </div>
      <p className="text-base font-medium text-foreground">
        {filtered ? C.filteredTitle : C.emptyTitle}
      </p>
      <p className="text-sm text-muted-foreground">
        {filtered ? C.filteredHint : C.emptyHint}
      </p>
    </div>
  )
}
