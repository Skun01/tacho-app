import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { LIBRARY_COPY } from '@/constants/library'

interface DeckPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DeckPagination({ page, totalPages, onPageChange }: DeckPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/85 px-4 py-3 shadow-[0_2px_10px_0_rgba(29,28,19,0.05)] dark:bg-surface-container-high dark:shadow-[0_8px_20px_0_rgba(0,0,0,0.24)]">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <CaretLeftIcon size={16} />
        {LIBRARY_COPY.actions.previousPage}
      </Button>

      <p className="text-sm text-muted-foreground">
        {LIBRARY_COPY.paginationSummary(page, totalPages)}
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {LIBRARY_COPY.actions.nextPage}
        <CaretRightIcon size={16} />
      </Button>
    </div>
  )
}
