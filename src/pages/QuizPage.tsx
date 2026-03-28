import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { XIcon, LightbulbIcon, ArrowCounterClockwiseIcon, InfoIcon } from '@phosphor-icons/react'
import { TypeAQuestion } from '@/components/quiz/TypeAQuestion'
import { TypeBQuestion } from '@/components/quiz/TypeBQuestion'
import { TypeCQuestion } from '@/components/quiz/TypeCQuestion'
import { FlashcardStack } from '@/components/quiz/FlashcardStack'
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
    initialCount, correctFirst, answeredFirst, progressPct,
    pendingMastery, masteryDelta,
    inputRef, cardInfoRef,
    handleCheck, handleSelectChoice, handleUndo, handleSeeAnswer,
    handleFlashcardAnswer, handleFlashcardSwipe, handleFlashcardUndo, flashcardHistory,
    handleNext, handleShowCardInfo,
  } = session

  const [isCardFlipped, setIsCardFlipped] = useState(false)
  useEffect(() => { setIsCardFlipped(false) }, [current?.id])
  function handleFlipCard() { setIsCardFlipped((prev) => !prev) }

  const [showHint, setShowHint] = useState(false)
  useEffect(() => { setShowHint(false) }, [current?.id])
  const hintEnabled = current?.type === 'A' && !!current?.promptKeyword

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
    onFlashcardSwipe: handleFlashcardSwipe,
    onFlashcardUndo: handleFlashcardUndo,
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
      {isTypeD ? (
        <main className="flex min-h-screen flex-col items-center justify-center px-6 pb-28 pt-16">
          <FlashcardStack
            cards={session.queue}
            isFlipped={isCardFlipped}
            onFlip={handleFlipCard}
            onSwipe={handleFlashcardSwipe}
            totalCards={initialCount}
            answeredCount={answeredFirst}
          />
        </main>
      ) : (
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
              <TypeAQuestion
                question={current}
                answerState={answerState}
                submittedValue={inputValue}
                showHint={showHint}
              />
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
      )}

      {/* ── Inline card detail ── */}
      <QuizCardInfoPanel
        show={showCardInfo}
        loading={cardInfoLoading}
        data={cardInfoData}
        innerRef={cardInfoRef}
      />

      {/* ── Floating scroll-to-top ── */}
      <ScrollToTop threshold={200} className="bottom-28 right-4" />

      {/* ── Flashcard always-visible controls ── */}
      {isTypeD && (
        <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center gap-3 px-4">
          <button
            onClick={handleFlashcardUndo}
            disabled={flashcardHistory.length === 0}
            className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              flashcardHistory.length === 0
                ? 'cursor-default border-[#1d1c13]/08 bg-background/70 text-muted-foreground/35'
                : 'border-[#1d1c13]/12 bg-background text-secondary shadow-sm hover:bg-surface-container'
            }`}
          >
            <ArrowCounterClockwiseIcon size={15} />
            {C.actionUndo}
          </button>
          <button
            onClick={handleShowCardInfo}
            className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              showCardInfo
                ? 'border-primary/20 bg-primary/8 text-primary'
                : 'border-[#1d1c13]/12 bg-background text-secondary shadow-sm hover:bg-surface-container'
            }`}
          >
            <InfoIcon size={15} />
            {showCardInfo ? C.actionCardInfoHide : C.actionCardInfo}
          </button>
        </div>
      )}

      {/* ── Action buttons (non-TypeD) ── */}
      {!isTypeD && (
        <QuizActionBar
          answerState={answerState}
          showCardInfo={showCardInfo}
          isTypeC={isTypeC}
          isTypeD={false}
          onUndo={handleUndo}
          onSeeAnswer={handleSeeAnswer}
          onShowCardInfo={handleShowCardInfo}
        />
      )}

      {/* ── Input bar (non-TypeD) ── */}
      {!isTypeD && (
        <QuizInputBar
          isTypeC={isTypeC}
          isTypeD={false}
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
      )}

      {/* ── Hotkey guide ── */}
      <QuizHotkeyGuide />

      {/* ── Hint toggle button (Type A only) ── */}
      {current.type === 'A' && (
        <button
          onClick={() => setShowHint((v) => !v)}
          disabled={!hintEnabled}
          aria-label={showHint ? C.hintHide : C.hintShow}
          title={showHint ? C.hintHide : C.hintShow}
          className={`fixed bottom-4 left-14 z-50 flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
            !hintEnabled
              ? 'cursor-default border-[#1d1c13]/08 bg-background/60 text-muted-foreground/35'
              : showHint
                ? 'border-amber-300 bg-amber-50 text-amber-600'
                : 'border-[#1d1c13]/12 bg-background text-muted-foreground hover:bg-surface-container hover:text-foreground'
          }`}
        >
          <LightbulbIcon size={14} weight={showHint ? 'fill' : 'regular'} />
        </button>
      )}
    </div>
  )
}
