import { useEffect, useState } from 'react'
import { LIBRARY_COPY, type CommunityCategory } from '@/constants/library'
import type { DeckCategory, DeckListItem } from '@/types/deck'
import { listDecks } from '@/services/deckService'
import { DeckCard } from './DeckCard'

const CATEGORY_MAP: Partial<Record<CommunityCategory, DeckCategory>> = {
  'Từ vựng cộng đồng': 'Từ vựng',
  'Ngữ pháp cộng đồng': 'Ngữ pháp',
  'Anime': 'Anime',
  'Manga': 'Manga',
  'Âm nhạc': 'Âm nhạc',
  'TV': 'TV',
  'Novel': 'Novel',
  'Game': 'Game',
  'Sách giáo khoa': 'Sách giáo khoa',
  'Khác': 'Khác',
}

interface Props {
  search: string
}

export function CommunityTab({ search }: Props) {
  const [category, setCategory] = useState<CommunityCategory>('Tất cả')
  const [allDecks, setAllDecks] = useState<DeckListItem[]>([])

  useEffect(() => {
    listDecks({ source: 'community' }).then(setAllDecks)
  }, [])

  const decks = allDecks.filter((d) => {
    const matchesCategory = category === 'Tất cả' || d.category === CATEGORY_MAP[category]
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(search.toLowerCase())
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
