import { Badge } from '@/components/ui/badge'

interface CardHeroProps {
  /** JLPT level badge (N5, N4...) */
  level: string | null
  /** Card type label ("Từ vựng", "Ngữ pháp", "Chữ hán") */
  typeLabel: string
  /** Large display text (writing / pattern) */
  title: string
  /** Short meaning / summary */
  summary: string
}

/**
 * Card hero section — reusable across Vocabulary, Grammar, Kanji cards.
 * Shows: level badge + type badge → large title → summary.
 */
export function CardHero({ level, typeLabel, title, summary }: CardHeroProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Badges row */}
      <div className="flex items-center gap-2">
        {level && (
          <Badge variant="outline" className="font-semibold text-xs">
            {level}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          {typeLabel}
        </Badge>
      </div>

      {/* Large title */}
      <h1
        className="font-heading-jp"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          lineHeight: 1.1,
          letterSpacing: '0.02em',
          color: 'var(--on-surface)',
        }}
      >
        {title}
      </h1>

      {/* Summary */}
      <p className="text-lg text-muted-foreground">{summary}</p>
    </div>
  )
}
