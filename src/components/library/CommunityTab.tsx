import { useState } from 'react'
import { LIBRARY_COPY, MOCK_COMMUNITY, type CommunityCategory } from '@/constants/library'
import { DeckCard } from './DeckCard'

interface Props {
  search: string
}

export function CommunityTab({ search }: Props) {
  const [category, setCategory] = useState<CommunityCategory>('Tất cả')

  const decks = MOCK_COMMUNITY.filter((d) => {
    const matchesCategory = category === 'Tất cả' || d.category === category
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.creator.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {LIBRARY_COPY.communityCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              category === cat
                ? 'bg-primary text-background'
                : 'bg-surface-container text-muted-foreground hover:text-foreground hover:bg-surface-container-highest'
            }`}
          >
            {cat}
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
