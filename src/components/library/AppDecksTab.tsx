import { useState } from 'react'
import {
  LIBRARY_COPY,
  MOCK_APP_VOCAB,
  MOCK_APP_GRAMMAR,
  MOCK_TEXTBOOKS,
  type AppSubTab,
  type DeckMock,
} from '@/constants/library'
import { DeckCard } from './DeckCard'

const DATA: Record<AppSubTab, DeckMock[]> = {
  'Từ vựng': MOCK_APP_VOCAB,
  'Ngữ pháp': MOCK_APP_GRAMMAR,
  'Sách giáo khoa': MOCK_TEXTBOOKS,
}

interface Props {
  search: string
}

export function AppDecksTab({ search }: Props) {
  const [subTab, setSubTab] = useState<AppSubTab>('Từ vựng')
  const decks = DATA[subTab].filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.creator.toLowerCase().includes(search.toLowerCase()),
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
