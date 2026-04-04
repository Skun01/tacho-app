import { GearSixIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'

/**
 * Tiến trình học card — placeholder for SRS data (chưa có backend).
 * Reusable for all card types (Vocabulary, Grammar, Kanji).
 */
export function CardProgress() {
  return (
    <Card className="border-none py-0 section-card-surface section-card-elevation">
      <CardContent className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-muted-foreground">
            {VOCAB_DETAIL_COPY.progress.title}
          </span>
          <GearSixIcon size={16} className="text-muted-foreground" />
        </div>

        {/* Coming soon placeholder */}
        <div className="flex flex-col items-center justify-center gap-2 py-4 opacity-60">
          <Badge variant="default" className="bg-amber-500 text-white border-none">
            {VOCAB_DETAIL_COPY.progress.comingSoon}
          </Badge>
          <div className="flex gap-6 text-center mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">{VOCAB_DETAIL_COPY.progress.nextReview}</span>
              <span className="text-xs font-semibold text-foreground">—</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">{VOCAB_DETAIL_COPY.progress.firstLearned}</span>
              <span className="text-xs font-semibold text-foreground">—</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">{VOCAB_DETAIL_COPY.progress.reviewCount}</span>
              <span className="text-xs font-semibold text-foreground">—</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
