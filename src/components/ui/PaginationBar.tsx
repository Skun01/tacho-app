import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'

interface PaginationBarProps {
  page: number
  total: number
  onChange: (next: number) => void
}

/** Pagination prev/next với label "page / total". Reusable. */
export function PaginationBar({ page, total, onChange }: PaginationBarProps) {
  if (total <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Trang trước"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm transition-colors hover:bg-surface-container disabled:opacity-30"
      >
        <CaretLeftIcon size={14} />
      </button>

      <span className="text-sm text-muted-foreground">
        {page} / {total}
      </span>

      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        aria-label="Trang sau"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm transition-colors hover:bg-surface-container disabled:opacity-30"
      >
        <CaretRightIcon size={14} />
      </button>
    </div>
  )
}
