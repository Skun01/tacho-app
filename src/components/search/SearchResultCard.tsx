import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PART_OF_SPEECH_LABELS, WORD_TYPE_LABELS } from '@/constants/search'
import type { VocabularyCardSummary } from '@/types/vocabulary'

interface SearchResultCardProps {
  card: VocabularyCardSummary
}

export function SearchResultCard({ card }: SearchResultCardProps) {
  const firstMeaning = card.meanings[0]
  const allDefinitions = card.meanings
    .flatMap((m) => m.definitions)
    .slice(0, 3)
    .join(', ')

  return (
    <Link to={`/vocabulary/${card.id}`} className="block group">
      <Card className="border-none shadow-none transition-all duration-300 group-hover:scale-[1.01] bg-surface-container-low py-0">
        <CardContent className="flex items-start justify-between gap-4 p-4">
          {/* Left: word info */}
          <div className="flex flex-col gap-1 min-w-0">
            {/* Writing + Reading */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-heading-jp text-xl text-foreground">
                {card.writing}
              </span>
              {card.reading && card.reading !== card.writing && (
                <span className="text-sm text-muted-foreground">
                  {card.reading}
                </span>
              )}
            </div>

            {/* Definitions */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {allDefinitions}
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {firstMeaning && (
                <Badge variant="secondary" className="text-[10px]">
                  {PART_OF_SPEECH_LABELS[firstMeaning.partOfSpeech] ??
                    firstMeaning.partOfSpeech}
                </Badge>
              )}
              {card.wordType && (
                <Badge
                  variant="default"
                  className="rounded text-[10px]"
                  style={{
                    backgroundColor: 'var(--tertiary)',
                    color: 'var(--tertiary-foreground)',
                    borderRadius: '0.25rem',
                  }}
                >
                  {WORD_TYPE_LABELS[card.wordType] ?? card.wordType}
                </Badge>
              )}
            </div>
          </div>

          {/* Right: JLPT badge */}
          {card.level && (
            <Badge variant="outline" className="shrink-0 font-semibold">
              {card.level}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
