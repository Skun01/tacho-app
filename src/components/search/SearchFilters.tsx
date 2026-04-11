import { XIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  const hasFilters = selectedCardType || selectedLevel

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground shrink-0">
          {SEARCH_COPY.filters.cardType}
        </span>
        {SEARCH_CARD_TYPE_OPTIONS.map((option) => (
          <Badge
            key={option.label}
            variant={selectedCardType === option.value ? 'default' : 'outline'}
            className="cursor-pointer transition-all duration-300 select-none"
            onClick={() => onCardTypeChange(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      {/* JLPT Level */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground shrink-0">
          {SEARCH_COPY.filters.level}
        </span>
        {Object.entries(JLPT_LEVEL_LABELS).map(([key, label]) => (
          <Badge
            key={key}
            variant={selectedLevel === key ? 'default' : 'outline'}
            className="cursor-pointer transition-all duration-300 select-none"
            onClick={() =>
              onLevelChange(selectedLevel === key ? undefined : (key as JlptLevel))
            }
          >
            {label}
          </Badge>
        ))}
      </div>

      {/* Clear all */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onCardTypeChange(undefined)
            onLevelChange(undefined)
          }}
          className="self-start gap-1 text-xs text-primary"
        >
          <XIcon size={12} weight="bold" />
          {SEARCH_COPY.filters.clearAll}
        </Button>
      )}
    </div>
  )
}
