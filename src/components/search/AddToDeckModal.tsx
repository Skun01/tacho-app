import { useEffect, useState } from 'react'
import { XIcon, CheckIcon } from '@phosphor-icons/react'
import { SEARCH_COPY } from '@/constants/search'
import type { DeckListItem } from '@/types/deck'
import { listDecks } from '@/services/deckService'

interface Props {
  cardCount: number
  onClose: () => void
  onConfirm: (deckId: string, deckName: string) => void
}

export function AddToDeckModal({ cardCount, onClose, onConfirm }: Props) {
  const [decks, setDecks] = useState<DeckListItem[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    listDecks({ isOwner: true }).then(setDecks)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-background shadow-2xl">
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h3 className="text-base font-bold text-foreground">
            {SEARCH_COPY.pickDeckTitle}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <XIcon size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto px-4 pb-2">
          {decks.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {SEARCH_COPY.pickDeckEmpty}
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {decks.map((deck) => (
                <li key={deck.id}>
                  <button
                    onClick={() => setSelected(deck.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      selected === deck.id
                        ? 'bg-primary/10'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <span
                      className={`flex-1 text-left text-sm font-medium ${
                        selected === deck.id ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {deck.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {deck.totalCards} thẻ
                    </span>
                    {selected === deck.id && (
                      <CheckIcon size={14} className="text-primary" weight="bold" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6 pt-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-surface-container py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
          >
            {SEARCH_COPY.pickDeckCancel}
          </button>
          <button
            disabled={!selected}
            onClick={() => {
              if (!selected) return
              const deck = decks.find((d) => d.id === selected)!
              onConfirm(selected, deck.name)
            }}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container disabled:opacity-40"
          >
            {SEARCH_COPY.pickDeckConfirm}
            {cardCount > 1 ? ` (${cardCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
