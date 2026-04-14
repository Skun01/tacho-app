import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SEARCH_COPY } from '@/constants/search'
import type { SearchCardSummary } from '@/types/search'

interface SearchResultCardProps {
  card: SearchCardSummary
}

export function SearchResultCard({ card }: SearchResultCardProps) {
  const href =
    card.cardType === 'Grammar'
      ? `/grammar/${card.id}`
      : card.cardType === 'Kanji'
        ? `/kanji/${card.id}`
        : `/vocabulary/${card.id}`
  const showAlternateForms = card.cardType === 'Grammar' && card.alternateForms.length > 0

  return (
    <Link to={href} className="block group">
      <Card className="border-none transition-all duration-300 py-0 section-card-surface section-card-elevation group-hover:scale-[1.01] group-hover:section-card-elevation-hover">
        <CardContent className="flex items-start justify-between gap-4 p-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-heading-jp text-xl text-foreground">
                {card.title}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {card.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-1 items-center">
              <Badge variant="secondary" className="text-[10px]">
                {SEARCH_COPY.cardTypePill[card.cardType]}
              </Badge>
              {showAlternateForms && (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {SEARCH_COPY.grammarAlternateForms}: {card.alternateForms.join(', ')}
                </span>
              )}
            </div>
          </div>

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
