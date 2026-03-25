import { CheckCircleIcon, ArrowSquareOutIcon } from '@phosphor-icons/react'
import { QUICK_STUDY_COPY } from '@/constants/quickStudy'
import type { DeckListItem } from '@/types/deck'

const COVER_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-rose-100 text-rose-600',
  'bg-amber-100 text-amber-600',
  'bg-violet-100 text-violet-600',
  'bg-emerald-100 text-emerald-600',
  'bg-yellow-100 text-yellow-600',
]

interface Props {
  deck: DeckListItem
  selected: boolean
  onSelect: () => void
}

export function QuickDeckCard({ deck, selected, onSelect }: Props) {
  const colorClass = COVER_COLORS[deck.coverIndex % 6]

  function handleViewDetail(e: React.MouseEvent) {
    e.stopPropagation()
    window.open(`/deck/${deck.id}`, '_blank')
  }

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-pressed={selected}
      className={`flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
        selected
          ? 'bg-primary/6 shadow-[0_2px_16px_0_rgba(0,36,83,0.12)]'
          : 'bg-background shadow-[0_1px_6px_0_rgba(29,28,19,0.07)] hover:shadow-[0_2px_12px_0_rgba(29,28,19,0.10)]'
      }`}
    >
      {/* Color swatch / icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${colorClass}`}
      >
        {deck.name.slice(0, 2)}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`truncate text-sm font-semibold leading-snug ${selected ? 'text-primary' : 'text-foreground'}`}>
            {deck.name}
          </p>
          {deck.source === 'app' && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {QUICK_STUDY_COPY.sourceBadge}
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {deck.vocabCount > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {QUICK_STUDY_COPY.vocabCount(deck.vocabCount)}
            </span>
          )}
          {deck.vocabCount > 0 && deck.grammarCount > 0 && (
            <span className="text-[11px] text-muted-foreground/40">·</span>
          )}
          {deck.grammarCount > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {QUICK_STUDY_COPY.grammarCount(deck.grammarCount)}
            </span>
          )}
          {deck.vocabCount === 0 && deck.grammarCount === 0 && (
            <span className="text-[11px] text-muted-foreground">
              {QUICK_STUDY_COPY.cardCount(deck.totalCards)}
            </span>
          )}
          {deck.category !== 'Mặc định' && (
            <>
              <span className="text-[11px] text-muted-foreground/40">·</span>
              <span className="text-[11px] text-muted-foreground">{deck.category}</span>
            </>
          )}
        </div>
      </div>

      {/* View detail link */}
      <button
        onClick={handleViewDetail}
        title={QUICK_STUDY_COPY.viewDetailLink}
        aria-label={QUICK_STUDY_COPY.viewDetailLink}
        className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-muted-foreground/60 transition-colors hover:bg-surface-container hover:text-secondary"
      >
        <ArrowSquareOutIcon size={13} />
        <span className="hidden sm:inline">{QUICK_STUDY_COPY.viewDetailLink}</span>
      </button>

      {/* Selected indicator */}
      <div className="shrink-0">
        {selected ? (
          <CheckCircleIcon size={20} weight="fill" className="text-primary" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/20" />
        )}
      </div>
    </div>
  )
}
