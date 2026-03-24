import { JlptBadge } from '@/components/ui/jlpt-badge'
import type { JlptLevel } from '@/types/card'

export type MasteryRowCard = {
  cardId: string
  content: string
  reading?: string
  jlptLevel: JlptLevel
  before: number
  after: number
}

export function QuizMasteryRow({ card }: { card: MasteryRowCard }) {
  const delta   = card.after - card.before
  const rowBg   = delta > 0 ? 'bg-emerald-50/70' : delta < 0 ? 'bg-rose-50/60' : 'bg-surface-container-low'
  const deltaTx = delta > 0 ? 'text-emerald-600'  : delta < 0 ? 'text-rose-500'  : 'text-muted-foreground/50'
  const arrow   = delta > 0 ? '↑' : delta < 0 ? '↓' : '–'

  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${rowBg}`}>
      <div className="min-w-0 flex-1">
        <p className="truncate font-kiwi text-lg font-medium leading-tight text-foreground">
          {card.content}
        </p>
        {card.reading && (
          <p className="text-xs text-muted-foreground">{card.reading}</p>
        )}
      </div>
      <JlptBadge level={card.jlptLevel} />
      <p className={`shrink-0 text-xs font-semibold ${deltaTx}`}>
        {arrow} Bậc {card.before} → {card.after}
      </p>
    </div>
  )
}
