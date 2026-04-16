import { BooksIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface DeckEmptyStateProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function DeckEmptyState({ title, actionLabel, onAction }: DeckEmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-surface-container p-4 text-primary">
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

