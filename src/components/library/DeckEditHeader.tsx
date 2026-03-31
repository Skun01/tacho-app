import {
  PencilSimpleIcon,
  PlusIcon,
  DownloadSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { DECK_COPY } from '@/constants/deck'
import { CARD_TYPE } from '@/types/card'
import { countByType } from '@/utils/cardUtils'
import type { FlashCard } from '@/types/card'
import type { DeckDetailWithState } from '@/types/deck'

const C = DECK_COPY.editPage

interface DeckEditHeaderProps {
  deck: DeckDetailWithState
  cards: FlashCard[]
  onEditInfo: () => void
  onAddCard: () => void
  onDelete: () => void
}

function MetaBadge({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span>
      <span className="font-semibold text-foreground">{label}: </span>
      {children}
    </span>
  )
}

/**
 * Header card của DeckEditPage:
 * - Tên deck + nút edit info
 * - Meta badges (category, creator, vocab/grammar count)
 * - Action buttons (add card, import (disabled), delete)
 */
export function DeckEditHeader({
  deck,
  cards,
  onEditInfo,
  onAddCard,
  onDelete,
}: DeckEditHeaderProps) {
  const vocabCount   = countByType(cards, CARD_TYPE.VOCAB)
  const grammarCount = countByType(cards, CARD_TYPE.GRAMMAR)

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-background p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
      {/* Name + edit button */}
      <div className="flex items-start gap-3">
        {deck.coverUrl && (
          <img
            src={deck.coverUrl}
            alt={deck.name}
            className="h-14 w-20 shrink-0 rounded-xl object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-bold text-foreground">{deck.name}</h1>
            <button
              onClick={onEditInfo}
              aria-label={C.editInfoTooltip}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
            >
              <PencilSimpleIcon size={14} className="text-muted-foreground" />
            </button>
          </div>
          {deck.description && (
            <p className="mt-1 text-sm text-muted-foreground">{deck.description}</p>
          )}
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <MetaBadge label={C.typeLabel}>{deck.category}</MetaBadge>
        <MetaBadge label={C.creatorLabel}>{deck.ownerName}</MetaBadge>
        {vocabCount > 0   && <span><span className="font-semibold text-foreground">{vocabCount}</span> {C.vocabLabel}</span>}
        {grammarCount > 0 && <span><span className="font-semibold text-foreground">{grammarCount}</span> {C.grammarLabel}</span>}
        <span className="ml-auto text-[10px] opacity-60">{C.maxCardsHint}</span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onAddCard}
          disabled={cards.length >= 1000}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-container disabled:opacity-40"
        >
          <PlusIcon size={14} weight="bold" />
          {C.addCardBtn}
        </button>

        <button
          disabled
          title={C.importDisabledHint}
          className="flex cursor-not-allowed items-center gap-1.5 rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-muted-foreground opacity-50"
        >
          <DownloadSimpleIcon size={14} />
          {C.importBtn}
        </button>

        <button
          onClick={onDelete}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
        >
          <TrashIcon size={14} />
          {C.deleteBtn}
        </button>
      </div>
    </div>
  )
}
