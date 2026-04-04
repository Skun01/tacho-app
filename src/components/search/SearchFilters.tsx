import { XIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SEARCH_COPY, JLPT_LEVEL_LABELS, PART_OF_SPEECH_LABELS } from '@/constants/search'
import type { JlptLevel, PartOfSpeech } from '@/types/vocabulary'

interface SearchFiltersProps {
  selectedLevel: JlptLevel | undefined
  selectedPos: PartOfSpeech | undefined
  onLevelChange: (level: JlptLevel | undefined) => void
  onPosChange: (pos: PartOfSpeech | undefined) => void
}

export function SearchFilters({
  selectedLevel,
  selectedPos,
  onLevelChange,
  onPosChange,
}: SearchFiltersProps) {
  const hasFilters = selectedLevel || selectedPos

  return (
    <div className="flex flex-col gap-3">
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

      {/* Part of Speech */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground shrink-0">
          {SEARCH_COPY.filters.partOfSpeech}
        </span>
        {Object.entries(PART_OF_SPEECH_LABELS).map(([key, label]) => (
          <Badge
            key={key}
            variant={selectedPos === key ? 'default' : 'outline'}
            className="cursor-pointer transition-all duration-300 select-none"
            onClick={() =>
              onPosChange(selectedPos === key ? undefined : (key as PartOfSpeech))
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
            onLevelChange(undefined)
            onPosChange(undefined)
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
