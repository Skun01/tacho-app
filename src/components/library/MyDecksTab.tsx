import { useEffect, useState } from 'react'
import { LIBRARY_COPY, type MySubTab } from '@/constants/library'
import type { DeckListItem } from '@/types/deck'
import { listDecks } from '@/services/deckService'
import { DeckCard } from './DeckCard'

interface Props {
  search: string
}

export function MyDecksTab({ search }: Props) {
  const [subTab, setSubTab] = useState<MySubTab>('Đang học')
  const [allDecks, setAllDecks] = useState<DeckListItem[]>([])

  useEffect(() => {
    const params =
      subTab === 'Đang học' ? { isInReview: true } :
      subTab === 'Cá nhân'  ? { isOwner: true } :
                              { isSaved: true }
    listDecks(params).then(setAllDecks)
  }, [subTab])

  const decks = allDecks.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 rounded-xl bg-surface-container p-1 w-fit">
        {LIBRARY_COPY.mySubTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              subTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {decks.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{LIBRARY_COPY.emptyState}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} showReview={subTab === 'Đang học'} />
          ))}
        </div>
      )}
    </div>
  )
}
