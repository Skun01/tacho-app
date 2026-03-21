import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  BookmarkSimpleIcon,
  BookmarkIcon,
  UsersThreeIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react'
import { LIBRARY_COPY } from '@/constants/library'
import type { DeckListItem } from '@/types/deck'

const COVER_GRADIENTS = [
  'from-[#d4e0f5] to-[#c8dde2]',
  'from-rose-100 to-pink-100',
  'from-amber-100 to-orange-50',
  'from-violet-100 to-purple-50',
  'from-emerald-50 to-teal-100',
  'from-yellow-50 to-amber-100',
]

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

interface DeckCardProps {
  deck: DeckListItem
  showReview?: boolean
}

export function DeckCard({ deck, showReview }: DeckCardProps) {
  const navigate = useNavigate()
  const [bookmarked, setBookmarked] = useState(deck.isBookmarked)
  const pct = deck.totalCards > 0 ? (deck.learnedCards / deck.totalCards) * 100 : 0

  return (
    <div
      onClick={() => navigate(`/deck/${deck.id}`)}
      className="flex flex-col overflow-hidden cursor-pointer rounded-2xl bg-background shadow-[0_2px_12px_0_rgba(29,28,19,0.07)] transition-shadow hover:shadow-[0_4px_20px_0_rgba(29,28,19,0.12)]"
    >
      <div
        className={`relative h-28 bg-gradient-to-br ${COVER_GRADIENTS[deck.coverIndex % 6]}`}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked((v) => !v) }}
          aria-label={LIBRARY_COPY.bookmarkAriaLabel}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/70 transition-colors hover:bg-background"
        >
          {bookmarked ? (
            <BookmarkSimpleIcon size={14} weight="fill" className="text-primary" />
          ) : (
            <BookmarkIcon size={14} className="text-muted-foreground" />
          )}
        </button>
        {deck.source === 'app' && (
          <span className="absolute bottom-2 left-3 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-background">
            {LIBRARY_COPY.systemBadge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {deck.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {deck.source === 'app'
            ? LIBRARY_COPY.editorLabel
            : `${LIBRARY_COPY.createdByPrefix} ${deck.ownerName}`}
        </p>

        {deck.learnedCards > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {deck.learnedCards}/{deck.totalCards} {LIBRARY_COPY.cardCountSuffix}
            </span>
            <div className="h-1 overflow-hidden rounded-full bg-surface-container">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {deck.vocabCount > 0 && (
            <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-muted-foreground">
              {deck.vocabCount} {LIBRARY_COPY.vocabShort}
            </span>
          )}
          {deck.grammarCount > 0 && (
            <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-muted-foreground">
              {deck.grammarCount} {LIBRARY_COPY.grammarShort}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
            <UsersThreeIcon size={12} />
            {formatCount(deck.userCount)}
          </span>
        </div>

        {showReview && (deck.reviewDue ?? 0) > 0 && (
          <button onClick={(e) => e.stopPropagation()} className="mt-1 flex items-center gap-1.5 self-start rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100">
            <ArrowsClockwiseIcon size={12} />
            {LIBRARY_COPY.reviewLabel}
            <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] text-rose-700">
              {deck.reviewDue}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
