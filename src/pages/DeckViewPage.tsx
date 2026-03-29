import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DeckViewHeader } from '@/components/library/DeckViewHeader'
import { DeckPageSkeleton } from '@/components/library/DeckPageSkeleton'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { CardRow } from '@/components/library/CardRow'
import { DECK_COPY } from '@/constants/deck'
import { useDeckView } from '@/hooks/useDeckView'

const C = DECK_COPY
const PER_PAGE = C.viewPage.perPage

export function DeckViewPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { deck, inReview, saved, handleToggleReview, handleToggleSaved, handleClone } = useDeckView(id)
  const [page, setPage] = useState(1)

  if (!deck) return (
    <DashboardLayout>
      {/* Back button visible even while loading */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container hover:text-foreground"
      >
        <ArrowLeftIcon size={14} />
        {C.editPage.backBtn}
      </button>
      <DeckPageSkeleton />
    </DashboardLayout>
  )

  const totalPages = Math.max(1, Math.ceil(deck.cards.length / PER_PAGE))
  const pageCards  = deck.cards.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container hover:text-foreground"
        >
          <ArrowLeftIcon size={14} />
          {C.editPage.backBtn}
        </button>

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
