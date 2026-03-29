import { useState } from 'react'
import { useParams } from 'react-router'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DeckViewHeader } from '@/components/library/DeckViewHeader'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { CardRow } from '@/components/library/CardRow'
import { DECK_COPY } from '@/constants/deck'
import { useDeckView } from '@/hooks/useDeckView'

const PER_PAGE = DECK_COPY.viewPage.perPage

export function DeckViewPage() {
  const { id } = useParams<{ id: string }>()
  const { deck, inReview, saved, handleToggleReview, handleToggleSaved, handleClone } = useDeckView(id)
  const [page, setPage] = useState(1)

  if (!deck) return (
    <DashboardLayout>
      <div className="py-16 text-center text-sm text-muted-foreground">
        {DECK_COPY.editPage.loading}
      </div>
    </DashboardLayout>
  )

  const totalPages = Math.max(1, Math.ceil(deck.cards.length / PER_PAGE))
  const pageCards  = deck.cards.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <DeckViewHeader
          deck={deck}
          inReview={inReview}
          saved={saved}
          onToggleReview={handleToggleReview}
          onToggleSaved={handleToggleSaved}
          onClone={handleClone}
        />

        <ul className="flex flex-col gap-2">
          {pageCards.map((card) => (
            <CardRow key={card.id} card={card} />
          ))}
        </ul>

        <PaginationBar page={page} total={totalPages} onChange={setPage} />
      </div>
    </DashboardLayout>
  )
}
