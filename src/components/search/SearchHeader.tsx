import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { SEARCH_COPY } from '@/constants/search'

interface SearchHeaderProps {
  query: string
  totalResults: number
  onQueryChange: (value: string) => void
  onSubmit: () => void
}

export function SearchHeader({
  query,
  totalResults,
  onQueryChange,
  onSubmit,
}: SearchHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search input — dùng shadcn Input, style filled theo DESIGN.md */}
      <div className="relative">
        <MagnifyingGlassIcon
          size={18}
          weight="bold"
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--on-surface-variant)' }}
        />
        <Input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder={SEARCH_COPY.inputPlaceholder}
          autoFocus
          className="h-12 rounded-xl border-none pl-10 text-base shadow-none"
          style={{
            backgroundColor: 'var(--surface-container)',
            color: 'var(--on-surface)',
          }}
        />
      </div>

      {/* Result count */}
      {query.trim() && (
        <p className="text-sm font-medium text-muted-foreground">
          {SEARCH_COPY.resultCount(totalResults, query)}
        </p>
      )}
    </div>
  )
}
