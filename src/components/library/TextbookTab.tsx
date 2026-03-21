import { useEffect, useState } from 'react'
import { LIBRARY_COPY } from '@/constants/library'
import type { DeckListItem } from '@/types/deck'
import { listDecks } from '@/services/deckService'
import { DeckCard } from './DeckCard'

interface Props {
  search: string
}

export function TextbookTab({ search }: Props) {
  const [allDecks, setAllDecks] = useState<DeckListItem[]>([])

  useEffect(() => {
    listDecks({ source: 'textbook' }).then(setAllDecks)
  }, [])

  const filtered = allDecks.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.textbook ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = filtered.reduce<Record<string, DeckListItem[]>>((acc, deck) => {
    const key = deck.textbook ?? 'Khác'
    if (!acc[key]) acc[key] = []
    acc[key].push(deck)
    return acc
  }, {})

  const groups = Object.entries(grouped)

  if (groups.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">{LIBRARY_COPY.emptyState}</p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {groups.map(([textbook, decks]) => (
        <section key={textbook}>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {LIBRARY_COPY.textbookGroupLabel}
            </span>
            <h3 className="text-base font-bold text-foreground">{textbook}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
