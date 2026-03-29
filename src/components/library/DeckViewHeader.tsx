import {
  ArrowsClockwiseIcon,
  BookmarkSimpleIcon,
  BookmarkIcon,
  CopyIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { DECK_COPY } from '@/constants/deck'
import { CARD_TYPE } from '@/types/card'
import type { DeckDetailWithState } from '@/types/deck'

const C = DECK_COPY.viewPage

interface DeckViewHeaderProps {
  deck: DeckDetailWithState
  inReview: boolean
  saved: boolean
  onToggleReview: () => void
  onToggleSaved: () => void
  onClone: () => void
}

function StatBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <span>
      <span className="font-semibold text-foreground">{label}: </span>
      {value}
    </span>
  )
}

/** Header card của DeckViewPage: thông tin deck + action buttons */
export function DeckViewHeader({
  deck,
  inReview,
  saved,
  onToggleReview,
  onToggleSaved,
  onClone,
}: DeckViewHeaderProps) {
  const navigate = useNavigate()
  const vocabCount   = deck.cards.filter((c) => c.type === CARD_TYPE.VOCAB).length
  const grammarCount = deck.cards.filter((c) => c.type === CARD_TYPE.GRAMMAR).length

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-background p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
      {/* Title + description */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">{deck.name}</h1>
        {deck.description && (
          <p className="text-sm text-muted-foreground">{deck.description}</p>
        )}
      </div>

      {/* Metadata badges */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <StatBadge label={C.creatorLabel}    value={deck.ownerName} />
        <StatBadge label={C.totalCardsLabel} value={deck.cards.length} />
        {vocabCount > 0   && <span><span className="font-semibold text-foreground">{vocabCount}</span> {C.vocabLabel}</span>}
        {grammarCount > 0 && <span><span className="font-semibold text-foreground">{grammarCount}</span> {C.grammarLabel}</span>}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onToggleReview}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            inReview
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'bg-primary text-background hover:bg-primary-container'
          }`}
        >
          <ArrowsClockwiseIcon size={14} />
          {inReview ? C.removeFromReviewBtn : C.addToReviewBtn}
        </button>

        <button
          onClick={onToggleSaved}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            saved
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-surface-container text-muted-foreground hover:bg-surface-container-highest'
          }`}
        >
          {saved
            ? <BookmarkSimpleIcon size={14} weight="fill" />
            : <BookmarkIcon size={14} />
          }
          {saved ? C.savedBtn : C.saveBtn}
        </button>

        <button
          onClick={onClone}
          className="flex items-center gap-1.5 rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
        >
          <CopyIcon size={14} />
          {C.cloneBtn}
        </button>

        {deck.isOwner && (
          <button
            onClick={() => navigate(`/deck/${deck.id}/edit`)}
            className="flex items-center gap-1.5 rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
          >
            <PencilSimpleIcon size={14} />
            {C.editBtn}
          </button>
        )}
      </div>
    </div>
  )
}
