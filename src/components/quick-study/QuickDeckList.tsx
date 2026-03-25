import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { QuickDeckCard } from './QuickDeckCard'
import { QUICK_STUDY_COPY } from '@/constants/quickStudy'
import { listDecks } from '@/services/deckService'
import type { DeckListItem } from '@/types/deck'

interface Props {
  selectedDeckId: string | null
  onSelect: (id: string) => void
}

export function QuickDeckList({ selectedDeckId, onSelect }: Props) {
  const [decks, setDecks] = useState<DeckListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    listDecks({ isSaved: true }).then((data) => {
      setDecks(data)
      setLoading(false)
    })
  }, [])

  const filtered = decks.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Search — filled style, no border */}
      <div className="flex items-center gap-2 rounded-xl bg-surface-container-highest px-4 py-2.5">
        <MagnifyingGlassIcon size={15} className="shrink-0 text-muted-foreground/60" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={QUICK_STUDY_COPY.deckSearchPlaceholder}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Deck list */}
      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-surface-container"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {decks.length === 0 ? QUICK_STUDY_COPY.emptyDecks : 'Không tìm thấy bộ thẻ phù hợp.'}
          </p>
        ) : (
          filtered.map((deck) => (
            <QuickDeckCard
              key={deck.id}
              deck={deck}
              selected={selectedDeckId === deck.id}
              onSelect={() => onSelect(deck.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
