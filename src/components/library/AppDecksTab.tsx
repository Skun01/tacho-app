import { useEffect, useState } from 'react'
import { LIBRARY_COPY, type AppSubTab } from '@/constants/library'
import type { DeckListItem } from '@/types/deck'
import { listDecks } from '@/services/deckService'
import { DeckCard } from './DeckCard'

interface Props {
  search: string
}

export function AppDecksTab({ search }: Props) {
  const [subTab, setSubTab] = useState<AppSubTab>('Từ vựng')
  const [allDecks, setAllDecks] = useState<DeckListItem[]>([])

  useEffect(() => {
    if (subTab === 'Sách giáo khoa') {
      listDecks({ source: 'textbook' }).then(setAllDecks)
    } else {
      const category = subTab === 'Từ vựng' ? 'Từ vựng' as const : 'Ngữ pháp' as const
      listDecks({ source: 'app', category }).then(setAllDecks)
    }
  }, [subTab])

  const decks = allDecks.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 rounded-xl bg-surface-container p-1 w-fit">
        {LIBRARY_COPY.appSubTabs.map((tab) => (
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
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  )
}
