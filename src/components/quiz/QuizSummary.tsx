import { useNavigate } from 'react-router'
import { TrophyIcon, ArrowRightIcon, HouseIcon, RepeatIcon } from '@phosphor-icons/react'
import { QUIZ_COPY } from '@/constants/quiz'
import type { QuizAttempt } from '@/types/quiz'

interface Props {
  attempts: QuizAttempt[]
  totalCards: number
  masteryChanges: Map<string, { before: number; after: number }>
}

export function QuizSummary({ attempts, totalCards, masteryChanges }: Props) {
  const navigate = useNavigate()

  const firstAttempts = attempts.filter((a) => !a.wasRetry)
  const correctOnFirst = firstAttempts.filter((a) => a.correct).length
  const wrongOnFirst = firstAttempts.filter((a) => !a.correct).length
  const accuracy = totalCards > 0 ? Math.round((correctOnFirst / totalCards) * 100) : 0

  let promoted = 0
  let demoted = 0
  masteryChanges.forEach(({ before, after }) => {
    if (after > before) promoted++
    else if (after < before) demoted++
  })

  const nextReview = (() => {
    const soon = new Date(Date.now() + 4 * 60 * 60 * 1000)
    return soon.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  })()

  const accentColor =
    accuracy >= 80 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'
  const accentBg =
    accuracy >= 80 ? 'bg-emerald-50' : accuracy >= 50 ? 'bg-amber-50' : 'bg-rose-50'

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-12">
      {/* Trophy */}
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${accentBg}`}>
        <TrophyIcon size={40} weight="fill" className={accentColor} />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground">{QUIZ_COPY.summaryTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{QUIZ_COPY.summarySubtitle}</p>
      </div>

      {/* Accuracy big number */}
      <div className={`w-full rounded-3xl ${accentBg} px-6 py-5 text-center`}>
        <p className={`text-5xl font-bold ${accentColor}`}>{accuracy}%</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{QUIZ_COPY.summaryAccuracy}</p>
      </div>

      {/* Stats grid */}
      <div className="w-full grid grid-cols-2 gap-3">
        <StatCard label={QUIZ_COPY.summaryTotal} value={totalCards} />
        <StatCard label={QUIZ_COPY.summaryCorrect} value={correctOnFirst} color="text-emerald-600" />
        <StatCard label={QUIZ_COPY.summaryWrong} value={wrongOnFirst} color="text-rose-600" />
        <StatCard label={QUIZ_COPY.summaryPromoted} value={promoted} color="text-primary" />
      </div>

      {/* Next review */}
      <div className="w-full rounded-2xl border border-[#1d1c13]/08 bg-background px-4 py-3">
        <p className="text-xs text-muted-foreground">{QUIZ_COPY.nextReviewLabel}</p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">Hôm nay lúc {nextReview}</p>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-2">
        <button
          onClick={() => navigate('/study')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
        >
          <ArrowRightIcon size={15} />
          {QUIZ_COPY.continueBtn}
        </button>
        <button
          onClick={() => navigate('/quiz')}
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#1d1c13]/10 px-4 py-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
        >
          <RepeatIcon size={14} />
          {QUIZ_COPY.backStudy}
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-container"
        >
          <HouseIcon size={14} />
          {QUIZ_COPY.backDashboard}
        </button>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'text-foreground',
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="rounded-2xl bg-background px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.06)]">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
