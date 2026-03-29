import { useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { VocabDetailView } from '@/components/card-detail/VocabDetailView'
import { GrammarDetailView } from '@/components/card-detail/GrammarDetailView'
import { CARD_DETAIL_COPY } from '@/constants/cardDetail'
import { useCardDetail } from '@/hooks/useCardDetail'

export function CardDetailPage() {
  const navigate = useNavigate()
  const { card } = useCardDetail()

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container hover:text-foreground"
        >
          <ArrowLeftIcon size={14} />
          {CARD_DETAIL_COPY.backLabel}
        </button>
      </div>

      {card === undefined && (
        <p className="py-24 text-center text-sm text-muted-foreground">
          {CARD_DETAIL_COPY.loading}
        </p>
      )}

      {card === null && (
        <p className="py-24 text-center text-sm text-muted-foreground">
          {CARD_DETAIL_COPY.notFound}
        </p>
      )}

      {card?.type === 'vocab'   && <VocabDetailView card={card} />}
      {card?.type === 'grammar' && <GrammarDetailView card={card} />}
    </DashboardLayout>
  )
}
