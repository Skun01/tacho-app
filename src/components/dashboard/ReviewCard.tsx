import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CaretDownIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { DASHBOARD_REVIEW } from '@/constants/dashboard'
import type { DashboardSummary } from '@/types/dashboard'

interface Props {
  review: DashboardSummary['review']
}

export function ReviewCard({ review }: Props) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const dueCount = review.totalDue

  function handleNavigateAll() {
    navigate('/quiz/config', { state: { batchIds: review.batchIds, mode: 'review' } })
  }

  return (
    <div
      onClick={handleNavigateAll}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleNavigateAll()}
      className="flex cursor-pointer flex-col rounded-2xl bg-[#e5eff0] shadow-[0_2px_16px_0_rgba(29,28,19,0.06)] transition-shadow hover:shadow-[0_4px_24px_0_rgba(74,98,103,0.18)]"
    >
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/70">
            <ArrowsClockwiseIcon size={16} className="text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{DASHBOARD_REVIEW.title}</p>
            <p className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.subtitle}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
          aria-label={DASHBOARD_REVIEW.expandAriaLabel}
          className="flex items-center gap-1 text-sm font-semibold text-foreground"
        >
          <span>{dueCount}</span>
          <CaretDownIcon
            size={14}
            className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {expanded ? (
        <div className="flex gap-4 px-5 pb-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/quiz/config', { state: { batchIds: review.batchIds, mode: 'review', type: 'vocab' } })
            }}
            className="flex flex-1 flex-col gap-0.5 rounded-xl bg-background/60 p-3 transition-colors hover:bg-background/90"
          >
            <span className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.vocabLabel}</span>
            <span className="text-lg font-bold text-primary">{review.vocab}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/quiz/config', { state: { batchIds: review.batchIds, mode: 'review', type: 'grammar' } })
            }}
            className="flex flex-1 flex-col gap-0.5 rounded-xl bg-background/60 p-3 transition-colors hover:bg-background/90"
          >
            <span className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.grammarLabel}</span>
            <span className="text-lg font-bold text-primary">{review.grammar}</span>
          </button>
        </div>
      ) : (
        <p className="px-5 pb-5 text-xs text-muted-foreground">{DASHBOARD_REVIEW.hint}</p>
      )}
    </div>
  )
}
