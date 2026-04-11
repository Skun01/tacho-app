import { Link } from 'react-router'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SEARCH_COPY } from '@/constants/search'

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <MagnifyingGlassIcon
        size={48}
        weight="duotone"
        style={{ color: 'var(--on-surface-variant)', opacity: 0.5 }}
      />
      <p
        className="font-heading-vn text-lg font-semibold"
        style={{ color: 'var(--on-surface)' }}
      >
        {SEARCH_COPY.noResults}
      </p>
      <p
        className="text-sm text-center max-w-xs"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        {SEARCH_COPY.noResultsHint}
      </p>
      <Button asChild variant="outline" size="sm">
        <Link to="/dashboard">{SEARCH_COPY.noResultsCta}</Link>
      </Button>
    </div>
  )
}
