import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { XIcon } from '@phosphor-icons/react'
import { TypeAQuestion } from '@/components/quiz/TypeAQuestion'
import { TypeBQuestion } from '@/components/quiz/TypeBQuestion'
import { TypeCQuestion } from '@/components/quiz/TypeCQuestion'
import { TypeDQuestion } from '@/components/quiz/TypeDQuestion'
import { QuizActionBar } from '@/components/quiz/QuizActionBar'
import { QuizCardInfoPanel } from '@/components/quiz/QuizCardInfoPanel'
import { QuizInputBar } from '@/components/quiz/QuizInputBar'
import { QuizHotkeyGuide } from '@/components/quiz/QuizHotkeyGuide'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useQuizSession, type QuizLocationState } from '@/hooks/useQuizSession'
import { useQuizKeyboard } from '@/hooks/useQuizKeyboard'
import { ScrollToTop } from '@/components/home/ScrollToTop'
import { QUIZ_COPY } from '@/constants/quiz'

const C = QUIZ_COPY

export function QuizPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state as QuizLocationState | null

  const session = useQuizSession(routeState, navigate)
  const {
    phase, current, answerState, inputValue, setInputValue,
    selectedChoiceId, audioPlayed, setAudioPlayed, visible,
    showCardInfo, cardInfoData, cardInfoLoading,
    initialCount, correctFirst, progressPct,
    pendingMastery, masteryDelta,
    inputRef, cardInfoRef,
    handleCheck, handleSelectChoice, handleUndo, handleSeeAnswer,
    handleFlashcardAnswer, handleNext, handleShowCardInfo,
  } = session

  const [isCardFlipped, setIsCardFlipped] = useState(false)
  useEffect(() => { setIsCardFlipped(false) }, [current?.id])
  function handleFlipCard() { setIsCardFlipped(true) }

  const audioUrl = current
    ? (current.type === 'B' ? current.exampleAudioUrl : current.audioUrl)
    : undefined

  const { skipNextEnterRef } = useQuizKeyboard({
    answerState,
    current,
    inputRef,
    isCardFlipped,
    onPlayAudio: () => setAudioPlayed(true),
    onNext: handleNext,
    onUndo: handleUndo,
    onSeeAnswer: handleSeeAnswer,
    onSelectChoice: handleSelectChoice,
    onShowCardInfo: handleShowCardInfo,
    onFlipCard: handleFlipCard,
    onFlashcardAnswer: handleFlashcardAnswer,
    navigate,
  })

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (phase === 'loading' || !current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const isTypeC = current.type === 'C'
  const isTypeD = current.type === 'D'
  const canSubmit = answerState === 'idle' && inputValue.trim().length > 0

  return (
    <div className="min-h-screen bg-background">

      {/* ── Top bar ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between bg-background px-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <XIcon size={15} />
        </button>

        <div
          className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
            masteryDelta > 0 ? 'text-emerald-600' : masteryDelta < 0 ? 'text-rose-600' : 'text-foreground'
          }`}
        >
          {masteryDelta > 0 && <span>↑</span>}
          {masteryDelta < 0 && <span>↓</span>}
          <span>{current.jlptLevel} · Bậc {pendingMastery}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="text-emerald-600">✓</span>
          <span>{correctFirst}/{initialCount}</span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      {initialCount > 0 && (
        <ProgressBar value={progressPct} className="fixed inset-x-0 top-12 z-40" />
      )}

      {/* ── Question area ── */}
      <main
        className={`flex min-h-screen flex-col items-center justify-center px-8 pt-12 ${
          isTypeC ? 'pb-20' : 'pb-36'
        }`}
      >
        {current.isRetry && (
          <span className="mb-6 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
            {C.retryBadge}
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
            />)}
          {current.type === 'D' && (
            <TypeDQuestion
              question={current}
              answerState={answerState}
              isFlipped={isCardFlipped}
              onFlip={handleFlipCard}
              onAnswer={handleFlashcardAnswer}
            />
          )}
        </div>
      </main>

      {/* ── Inline card detail ── */}
      <QuizCardInfoPanel
        show={showCardInfo}
        loading={cardInfoLoading}
        data={cardInfoData}
        innerRef={cardInfoRef}
      />

      {/* ── Floating scroll-to-top ── */}
      <ScrollToTop threshold={200} className="bottom-28 right-4" />

      {/* ── Action buttons ── */}
      <QuizActionBar
        answerState={answerState}
        showCardInfo={showCardInfo}
        isTypeC={isTypeC}
        isTypeD={isTypeD}
        onUndo={handleUndo}
        onSeeAnswer={handleSeeAnswer}
        onShowCardInfo={handleShowCardInfo}
      />

      {/* ── Input bar / Type C next ── */}
      <QuizInputBar
        isTypeC={isTypeC}
        isTypeD={isTypeD}
        answerState={answerState}
        inputValue={inputValue}
        inputRef={inputRef}
        audioUrl={audioUrl}
        canSubmit={canSubmit}
        skipNextEnterRef={skipNextEnterRef}
        onChange={setInputValue}
        onCheck={handleCheck}
        onNext={handleNext}
        onPlayAudio={() => setAudioPlayed(true)}
      />

      {/* ── Hotkey guide ── */}
      <QuizHotkeyGuide />
    </div>
  )
}
