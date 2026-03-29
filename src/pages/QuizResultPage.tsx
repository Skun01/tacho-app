import { useNavigate, useLocation } from 'react-router'
import { XIcon, TrophyIcon, ArrowRightIcon, HouseIcon } from '@phosphor-icons/react'
import { QuizStatCard } from '@/components/quiz/QuizStatCard'
import { QuizMasteryRow } from '@/components/quiz/QuizMasteryRow'
import type { MasteryRowCard } from '@/components/quiz/QuizMasteryRow'
import type { QuizAttempt } from '@/types/quiz'
import { QUIZ_COPY, QUIZ_GRADES, ACCURACY_THRESHOLDS } from '@/constants/quiz'

type ResultState = {
  attempts: QuizAttempt[]
  totalCards: number
  cardInfos: MasteryRowCard[]
  batchIds?: string[]
  mode?: 'learn' | 'review'
}

const C = QUIZ_COPY

export function QuizResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as ResultState | null) ?? {
    attempts: [],
    totalCards: 0,
    cardInfos: [],
  }

  const { attempts, totalCards, cardInfos } = state
  const batchIds = state.batchIds ?? []
  const mode = state.mode ?? 'learn'
  const firstAttempts = attempts.filter((a) => !a.wasRetry)
  const correctOnFirst = firstAttempts.filter((a) => a.correct).length
  const wrongOnFirst   = firstAttempts.filter((a) => !a.correct).length
  const accuracy       = totalCards > 0 ? Math.round((correctOnFirst / totalCards) * 100) : 0
  const promoted       = cardInfos.filter((c) => c.after > c.before).length

  const grade = QUIZ_GRADES.find((g) => accuracy >= g.min) ?? QUIZ_GRADES[QUIZ_GRADES.length - 1]

  const accentColor =
    accuracy >= ACCURACY_THRESHOLDS.EXCELLENT ? 'text-emerald-600'
    : accuracy >= ACCURACY_THRESHOLDS.GOOD    ? 'text-amber-500'
    : 'text-rose-500'
  const accentBg =
    accuracy >= ACCURACY_THRESHOLDS.EXCELLENT ? 'bg-emerald-50'
    : accuracy >= ACCURACY_THRESHOLDS.GOOD    ? 'bg-amber-50'
    : 'bg-rose-50'
  const trophyClass =
    accuracy >= ACCURACY_THRESHOLDS.EXCELLENT ? 'text-emerald-600'
    : accuracy >= ACCURACY_THRESHOLDS.GOOD    ? 'text-amber-500'
    : 'text-rose-500'

  function handleContinue() {
    navigate('/study', { state: { batchIds, mode } })
  }
  function handleGoHome() {
    navigate('/dashboard')
  }

  return (
    <div className="flex h-screen flex-col bg-background">

      {/* ── Header ── */}
      <header className="flex h-12 shrink-0 items-center justify-between bg-background/90 px-4 backdrop-blur-sm">
        <button
          onClick={handleGoHome}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <XIcon size={15} />
        </button>
        <p className="text-sm font-semibold text-foreground">{C.resultPageTitle}</p>
        <div className="h-8 w-8" />
      </header>

      {/* ── Body ── */}
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
        <div className="mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col gap-3">

          {/* ── Trophy + grade ── */}
          <div className={`flex items-center gap-4 rounded-3xl px-5 py-4 ${accentBg}`}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/60">
              <TrophyIcon size={32} weight="fill" className={trophyClass} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-foreground">{grade.title}</h1>
              <p className="text-xs text-muted-foreground">{grade.sub}</p>
            </div>
            <p className={`shrink-0 text-5xl font-bold tracking-tight ${accentColor}`}>{accuracy}%</p>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-4 gap-2">
            <QuizStatCard label={C.resultStatTotal}    value={totalCards}     />
            <QuizStatCard label={C.resultStatCorrect}  value={correctOnFirst} color="text-emerald-600" />
            <QuizStatCard label={C.resultStatWrong}    value={wrongOnFirst}   color="text-rose-500" />
            <QuizStatCard label={C.resultStatPromoted} value={promoted}       color="text-primary" />
          </div>

          {/* ── Per-card mastery changes — scrollable ── */}
          {cardInfos.length > 0 && (
            <section className="flex min-h-0 flex-1 flex-col">
              <p className="mb-2 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {C.resultMasteryChangeLabel}
              </p>
              <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
                {cardInfos.map((c) => (
                  <QuizMasteryRow key={c.cardId} card={c} />
                ))}
              </div>
            </section>
          )}

          {/* ── Actions ── */}
          <div className="flex shrink-0 flex-col gap-2 pt-1">
            <button
              onClick={handleContinue}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
            >
              {C.resultContinueBtn}
              <ArrowRightIcon size={15} />
            </button>
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#1d1c13]/10 px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
            >
              <HouseIcon size={14} />
              {C.resultHomeBtn}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
