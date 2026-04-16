import { FunnelSimpleIcon } from '@phosphor-icons/react'
import { SEARCH_COPY, JLPT_LEVEL_LABELS, SEARCH_CARD_TYPE_OPTIONS } from '@/constants/search'
import type { SearchCardType } from '@/types/search'
import type { JlptLevel } from '@/types/vocabulary'

interface SearchFiltersProps {
  selectedCardType: SearchCardType | undefined
  selectedLevel: JlptLevel | undefined
  onCardTypeChange: (cardType: SearchCardType | undefined) => void
  onLevelChange: (level: JlptLevel | undefined) => void
}

export function SearchFilters({
  selectedCardType,
  selectedLevel,
  onCardTypeChange,
  onLevelChange,
}: SearchFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full p-1"
        style={{ backgroundColor: 'var(--surface-container)' }}
      >
        {SEARCH_CARD_TYPE_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => onCardTypeChange(option.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 ${
              selectedCardType === option.value
                ? 'bg-background text-primary shadow-sm'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        className="hidden h-5 w-px md:block"
        style={{ backgroundColor: 'var(--surface-container-highest)' }}
      />

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <FunnelSimpleIcon size={13} />
          {SEARCH_COPY.filters.level}
        </span>
        {Object.entries(JLPT_LEVEL_LABELS).map(([key, label]) => (
          <button
            key={key}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 ${
              selectedLevel === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-container text-secondary hover:bg-surface-container-highest hover:text-foreground'
            }`}
            onClick={() =>
              onLevelChange(selectedLevel === key ? undefined : (key as JlptLevel))
            }
          >
            {label}
          </button>
        ))}
      </div>

      {(selectedCardType || selectedLevel) && (
        <button
          onClick={() => {
            onCardTypeChange(undefined)
            onLevelChange(undefined)
          }}
          className="ml-auto rounded-full px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          {SEARCH_COPY.filters.clearAll}
        </button>
      )}
    </div>
  )
}
