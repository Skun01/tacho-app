import { useEffect, useState } from 'react'
import { XIcon, MagnifyingGlassIcon, CheckIcon, PlusIcon } from '@phosphor-icons/react'
import { DECK_COPY } from '@/constants/deck'
import type { FlashCard, FlashCardWithProgress } from '@/types/card'
import { searchCards } from '@/services/cardService'
import { TypeBadge } from '@/components/ui/type-badge'
import { JlptBadge } from '@/components/ui/jlpt-badge'

const MASTERY_COLORS = ['bg-surface-container', 'bg-rose-200', 'bg-orange-200', 'bg-yellow-200', 'bg-lime-200', 'bg-emerald-300']

interface AddCardModalProps {
  existingIds: Set<string>
  onAdd: (card: FlashCard) => void
  onRemove: (id: string) => void
  onClose: () => void
}

export function AddCardModal({ existingIds, onAdd, onRemove, onClose }: AddCardModalProps) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<FlashCardWithProgress[]>([])
  const C = DECK_COPY.addCard

  useEffect(() => {
    searchCards(search).then(setResults)
  }, [search])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-background shadow-2xl" style={{ maxHeight: '80vh' }}>
        <div className="flex items-center justify-between border-b border-[#1d1c13]/8 px-6 py-4">
          <h2 className="text-base font-bold text-foreground">{C.title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <XIcon size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-[#1d1c13]/8 px-5 py-3">
          <MagnifyingGlassIcon size={15} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={C.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{C.noResults}</p>
          ) : (
            <ul>
              {results.map((card) => {
                const added = existingIds.has(card.id)
                return (
                  <li
                    key={card.id}
                    className="flex items-center gap-3 border-b border-[#1d1c13]/6 px-5 py-3 last:border-0"
                  >
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <TypeBadge type={card.type} />
                        <JlptBadge level={card.jlptLevel} />
                        {card.progress !== undefined && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <span>{C.masteryLabel}:</span>
                            <span className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    i < (card.progress?.masteryLevel ?? 0)
                                      ? MASTERY_COLORS[card.progress?.masteryLevel ?? 0]
                                      : 'bg-surface-container-highest'
                                  }`}
                                />
                              ))}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-kiwi text-base font-medium text-foreground">{card.content}</span>
                        {card.type === 'vocab' && card.reading && (
                          <span className="text-xs text-muted-foreground">({card.reading})</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{card.meaning}</span>
                    </div>

                    <button
                      onClick={() => added ? onRemove(card.id) : onAdd(card)}
                      className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        added
                          ? 'bg-primary text-background hover:bg-primary/80'
                          : 'bg-surface-container text-muted-foreground hover:bg-surface-container-highest'
                      }`}
                      aria-label={added ? C.removeBtn : C.addBtn}
                    >
                      {added ? <CheckIcon size={14} weight="bold" /> : <PlusIcon size={14} weight="bold" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-[#1d1c13]/8 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
          >
            {C.doneBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
