import { LearnCard } from './LearnCard'
import { ReviewCard } from './ReviewCard'
import type { DashboardSummary } from '@/types/dashboard'

interface Props {
  learn: DashboardSummary['learn']
  review: DashboardSummary['review']
}

export function MainActionSection({ learn, review }: Props) {
  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
      <LearnCard learn={learn} />
      <ReviewCard review={review} />
    </div>
  )
}
