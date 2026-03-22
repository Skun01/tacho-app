import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { VocabDetailView } from '@/components/card-detail/VocabDetailView'
import { GrammarDetailView } from '@/components/card-detail/GrammarDetailView'
import { CARD_DETAIL_COPY } from '@/constants/cardDetail'
import { getCardDetail } from '@/services/cardDetailService'
import type { CardDetail } from '@/types/card'

export function CardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [card, setCard] = useState<CardDetail | null | undefined>(undefined)

  useEffect(() => {
    if (!id) { setCard(null); return }
    getCardDetail(id).then(setCard)
  }, [id])

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

      {card?.type === 'vocab' && <VocabDetailView card={card} />}
      {card?.type === 'grammar' && <GrammarDetailView card={card} />}
    </DashboardLayout>
  )
}
