import { SEARCH_COPY } from '@/constants/search'

interface Props {
  count: number
  onAddToDeck: () => void
  onStartStudy: () => void
  onDeselect: () => void
}

export function BulkActionBar({ count, onAddToDeck, onStartStudy, onDeselect }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-foreground px-4 py-2.5 shadow-[0_8px_32px_0_rgba(29,28,19,0.22)]">
      <span className="whitespace-nowrap text-sm font-semibold text-background/90 pr-1">
        {SEARCH_COPY.selectedCount(count)}
      </span>
      <div className="h-4 w-px bg-background/20" />
      <button
        onClick={onAddToDeck}
        className="rounded-xl bg-background/15 px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-background/25"
      >
        {SEARCH_COPY.bulkAddToDeck}
      </button>
      <button
        onClick={onStartStudy}
        className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-primary-container"
      >
        {SEARCH_COPY.bulkStartStudy}
      </button>
      <button
        onClick={onDeselect}
        className="px-2 py-1.5 text-xs font-medium text-background/60 transition-colors hover:text-background"
      >
        {SEARCH_COPY.bulkDeselect}
      </button>
    </div>
  )
}
