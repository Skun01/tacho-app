import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { XIcon, ArrowRightIcon, ArrowCounterClockwiseIcon, InfoIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import { TypeAQuestion } from '@/components/quiz/TypeAQuestion'
import { TypeBQuestion } from '@/components/quiz/TypeBQuestion'
import { TypeCQuestion } from '@/components/quiz/TypeCQuestion'
import { QuizSummary } from '@/components/quiz/QuizSummary'
import { getCardDetail } from '@/services/cardDetailService'
import { generateQuestion, checkAnswer } from '@/utils/quizGenerator'
import { STUDY_BATCH_IDS } from '@/mocks/studyBatch'
import { QUIZ_COPY } from '@/constants/quiz'
import type { CardDetail } from '@/types/card'
import type { QuizQuestion, AnswerState, QuizAttempt } from '@/types/quiz'

type Phase = 'loading' | 'quiz' | 'summary'

export function QuizPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef<HTMLInputElement>(null)

  const batchIds: string[] = (location.state as any)?.batchIds ?? STUDY_BATCH_IDS

  const [phase, setPhase] = useState<Phase>('loading')
  const [queue, setQueue] = useState<QuizQuestion[]>([])
  const [initialCount, setInitialCount] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [inputValue, setInputValue] = useState('')
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [masteryChanges, setMasteryChanges] = useState<
    Map<string, { before: number; after: number }>
  >(new Map())
  const [visible, setVisible] = useState(true)

  // ── Load ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const cards = await Promise.all(batchIds.map((id) => getCardDetail(id)))
      const valid = cards.filter((c): c is CardDetail => c !== null)
      const allMeanings = valid.map((c) => c.meaning)
      const questions = valid.map((c) => generateQuestion(c, allMeanings))
      setQueue(questions)
      setInitialCount(questions.length)
      const mc = new Map<string, { before: number; after: number }>()
      valid.forEach((c) => {
        const stage = c.userProgress?.masteryStage ?? 0
        mc.set(c.id, { before: stage, after: stage })
      })
      setMasteryChanges(mc)
      setPhase('quiz')
    }
    init()
  }, [])

  const current = queue[0] ?? null

  // ── Mastery preview in top bar ────────────────────────────────────────────────
  const currentMastery = current ? (masteryChanges.get(current.cardId)?.after ?? 0) : 0
  const pendingMastery =
    answerState === 'idle'
      ? currentMastery
      : Math.max(0, Math.min(14, currentMastery + (answerState === 'correct' ? 1 : -2)))
  const masteryDelta = pendingMastery - currentMastery

  // ── Correct counter (first attempts only) ────────────────────────────────────
  const correctFirst = attempts.filter((a) => !a.wasRetry && a.correct).length

  // ── Check answer ──────────────────────────────────────────────────────────────
  const handleCheck = useCallback(() => {
    if (!current || answerState !== 'idle') return
    const correct = checkAnswer(current, inputValue)
    setAnswerState(correct ? 'correct' : 'wrong')
  }, [current, answerState, inputValue])

  function handleSelectChoice(choiceId: string, isCorrect: boolean) {
    if (answerState !== 'idle') return
    setSelectedChoiceId(choiceId)
    setAnswerState(isCorrect ? 'correct' : 'wrong')
  }

  // ── Undo ──────────────────────────────────────────────────────────────────────
  function handleUndo() {
    setAnswerState('idle')
    setSelectedChoiceId(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── See answer ────────────────────────────────────────────────────────────────
  function handleSeeAnswer() {
    if (!current) return
    setInputValue(current.correctAnswer)
    setAnswerState('correct')
  }

  // ── Advance ───────────────────────────────────────────────────────────────────
  function handleNext() {
    if (!current) return
    const isCorrect = answerState === 'correct'

    setAttempts((prev) => [
      ...prev,
      { cardId: current.cardId, questionId: current.id, correct: isCorrect, wasRetry: current.isRetry },
    ])
    setMasteryChanges((prev) => {
      const existing = prev.get(current.cardId)!
      const after = Math.max(0, Math.min(14, existing.after + (isCorrect ? 1 : -2)))
      return new Map(prev).set(current.cardId, { ...existing, after })
    })

    const remaining = queue.slice(1)
    if (isCorrect && remaining.length === 0) {
      setPhase('summary')
      setQueue([])
      return
    }

    setVisible(false)
    setTimeout(() => {
      if (isCorrect) {
        setQueue(remaining)
      } else {
        setQueue([...remaining, { ...current, id: `${current.id}-r`, isRetry: true }])
      }
      setAnswerState('idle')
      setInputValue('')
      setSelectedChoiceId(null)
      setAudioPlayed(false)
      setVisible(true)
      window.scrollTo({ top: 0, behavior: 'instant' })
      setTimeout(() => inputRef.current?.focus(), 80)
    }, 150)
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && answerState !== 'idle') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answerState, current])

  useEffect(() => {
    if (current?.type !== 'C') setTimeout(() => inputRef.current?.focus(), 100)
  }, [current?.id])

  // ── Summary ───────────────────────────────────────────────────────────────────
  if (phase === 'summary') {
    return (
      <div className="min-h-screen bg-background">
        <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between bg-background/90 px-4 backdrop-blur-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <XIcon size={16} />
          </button>
          <p className="text-sm font-semibold text-foreground">{QUIZ_COPY.title}</p>
          <div className="h-8 w-8" />
        </header>
        <div className="pt-12">
          <QuizSummary attempts={attempts} totalCards={initialCount} masteryChanges={masteryChanges} />
        </div>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (phase === 'loading' || !current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const isTypeC = current.type === 'C'
  const canSubmit = answerState === 'idle' && inputValue.trim().length > 0

  const barBorderClass =
    answerState === 'correct'
      ? 'border-emerald-400 bg-emerald-50/80'
      : answerState === 'wrong'
        ? 'border-rose-400 bg-rose-50/80'
        : 'border-[#1d1c13]/12 bg-background'

  const inputTextClass =
    answerState === 'correct'
      ? 'text-emerald-600'
      : answerState === 'wrong'
        ? 'text-rose-600'
        : 'text-foreground'

  const arrowClass =
    answerState !== 'idle' || canSubmit
      ? 'bg-foreground/90 text-background hover:bg-foreground'
      : 'text-muted-foreground/30 cursor-not-allowed'

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ── Top bar ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <XIcon size={15} />
        </button>

        {/* Level + mastery (updates live after answering) */}
        <div
          className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
            masteryDelta > 0
              ? 'text-emerald-600'
              : masteryDelta < 0
                ? 'text-rose-600'
                : 'text-foreground'
          }`}
        >
          {masteryDelta > 0 && <span>↑</span>}
          {masteryDelta < 0 && <span>↓</span>}
          <span>{current.jlptLevel} · Bậc {pendingMastery}</span>
        </div>

        {/* Correct / total */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="text-emerald-600">✓</span>
          <span>{correctFirst}/{initialCount}</span>
        </div>
      </header>

      {/* ── Vertically centered question ── */}
      <main
        className="flex flex-1 flex-col items-center justify-center px-8"
        style={{ paddingTop: '3rem', paddingBottom: isTypeC ? '5rem' : '9rem' }}
      >
        {current.isRetry && (
          <span className="mb-6 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
            Ôn lại
          </span>
        )}

        <div
          key={current.id}
          className={`w-full max-w-2xl transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          {current.type === 'A' && (
            <TypeAQuestion question={current} answerState={answerState} submittedValue={inputValue} />
          )}
          {current.type === 'B' && (
            <TypeBQuestion
              question={current}
              answerState={answerState}
              submittedValue={inputValue}
              hasPlayed={audioPlayed}
              onPlay={() => setAudioPlayed(true)}
            />
          )}
          {current.type === 'C' && (
            <TypeCQuestion
              question={current}
              answerState={answerState}
              selectedId={selectedChoiceId}
              onSelect={handleSelectChoice}
            />
          )}
        </div>
      </main>

      {/* ── Action buttons (appear after answering, above input bar) ── */}
      {answerState !== 'idle' && (
        <div
          className="fixed inset-x-0 z-30 flex justify-center gap-2 px-4"
          style={{ bottom: isTypeC ? '5rem' : '5.5rem' }}
        >
          <ActionBtn icon={<ArrowCounterClockwiseIcon size={12} />} onClick={handleUndo}>
            Hoàn tác
          </ActionBtn>
          <ActionBtn icon={<InfoIcon size={12} />}>
            Xem gợi ý
          </ActionBtn>
          {answerState === 'wrong' ? (
            <ActionBtn onClick={handleSeeAnswer} highlight>
              ✓ Xem đáp án
            </ActionBtn>
          ) : (
            <ActionBtn disabled>
              = Không có alt.
            </ActionBtn>
          )}
        </div>
      )}

      {/* ── Bottom input bar (Type A + B) ── */}
      {!isTypeC && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6 pt-2">
          <div
            className={`mx-auto flex max-w-xl items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-sm transition-all duration-200 ${barBorderClass}`}
          >
            <button
              disabled={!current.audioUrl}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                current.audioUrl
                  ? 'text-secondary hover:bg-surface-container'
                  : 'text-muted-foreground/25'
              }`}
            >
              <SpeakerHighIcon size={15} weight="fill" />
            </button>

            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => answerState === 'idle' && setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && answerState === 'idle' && inputValue.trim()) handleCheck()
              }}
              readOnly={answerState !== 'idle'}
              placeholder={QUIZ_COPY.inputPlaceholder}
              className={`flex-1 bg-transparent font-kiwi text-lg outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/40 ${inputTextClass}`}
            />

            <button
              onClick={answerState === 'idle' ? handleCheck : handleNext}
              disabled={answerState === 'idle' && !canSubmit}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${arrowClass}`}
            >
              <ArrowRightIcon size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Type C: full-width "Tiếp theo" after selection ── */}
      {isTypeC && answerState !== 'idle' && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6">
          <button
            onClick={handleNext}
            className={`mx-auto flex w-full max-w-xl items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-colors ${
              answerState === 'correct'
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
          >
            {QUIZ_COPY.nextBtn}
            <ArrowRightIcon size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

function ActionBtn({
  children,
  icon,
  onClick,
  highlight,
  disabled,
}: {
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  highlight?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
        disabled
          ? 'cursor-default border-[#1d1c13]/08 bg-background/60 text-muted-foreground/35'
          : highlight
            ? 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
            : 'border-[#1d1c13]/10 bg-background text-secondary hover:bg-surface-container'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
