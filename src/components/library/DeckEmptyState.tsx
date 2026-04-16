import { BooksIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface DeckEmptyStateProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function DeckEmptyState({ title, actionLabel, onAction }: DeckEmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/80 px-6 py-12 text-center shadow-[0_2px_12px_0_rgba(29,28,19,0.06)] dark:bg-surface-container-high dark:shadow-[0_10px_24px_0_rgba(0,0,0,0.24)]">
      <div className="mb-4 rounded-full border border-border/60 bg-surface-container-high p-4 text-primary dark:bg-surface-container-highest">
        <BooksIcon size={28} />
      </div>
      <p className="max-w-md text-sm text-muted-foreground">{title}</p>
      {actionLabel && onAction && (
        <Button type="button" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
