import type { RefObject } from 'react'
import { VocabDetailView } from '@/components/card-detail/VocabDetailView'
import { GrammarDetailView } from '@/components/card-detail/GrammarDetailView'
import type { CardDetail } from '@/types/card'

interface Props {
  show: boolean
  loading: boolean
  data: CardDetail | null
  innerRef: RefObject<HTMLDivElement | null>
}

export function QuizCardInfoPanel({ show, loading, data, innerRef }: Props) {
  if (!show) return null

  return (
    <div ref={innerRef} className="border-t border-[#1d1c13]/08 px-4 pb-36 pt-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Thông tin thẻ
        </p>
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {!loading && data?.type === 'vocab' && <VocabDetailView card={data} />}
        {!loading && data?.type === 'grammar' && <GrammarDetailView card={data} />}
      </div>
    </div>
  )
}
