import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import type { QuizQuestion, AnswerState } from '@/types/quiz'
import { QUIZ_COPY } from '@/constants/quiz'

interface Props {
  question: QuizQuestion
  answerState: AnswerState
  isFlipped: boolean
  onFlip: () => void
  onAnswer: (correct: boolean) => void
}

export function TypeDQuestion({ question, answerState, isFlipped, onFlip, onAnswer }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">

      {/* ── Type label ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
        {QUIZ_COPY.typeLabelD}
      </p>

      {/* ── Flip card ── */}
      <div
        className="w-full max-w-sm"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative"
          style={{
            height: '240px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ── Front face ── */}
          <div
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl bg-background px-8 shadow-[0_2px_20px_0_rgba(29,28,19,0.1)] select-none"
            style={{ backfaceVisibility: 'hidden' }}
            onClick={answerState === 'idle' ? onFlip : undefined}
          >
            <JlptBadge level={question.jlptLevel as any} />
            <p className="font-kiwi text-5xl font-medium tracking-wide text-foreground">
              {question.cardContent}
            </p>
            {question.cardReading && (
              <p className="text-base text-muted-foreground">{question.cardReading}</p>
            )}
            {answerState === 'idle' && (
              <p className="mt-2 text-xs text-muted-foreground/50">{QUIZ_COPY.flipHint}</p>
            )}
          </div>

          {/* ── Back face ── */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl px-8 shadow-[0_2px_20px_0_rgba(29,28,19,0.1)] select-none ${
              answerState === 'correct'
                ? 'bg-emerald-50'
                : answerState === 'wrong'
                  ? 'bg-rose-50'
                  : 'bg-surface-container-low'
            }`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="font-kiwi text-4xl font-medium tracking-wide text-foreground">
              {question.cardContent}
            </p>
            <div className="mt-1 h-px w-12 bg-[#1d1c13]/10" />
            <p className="text-center text-lg font-semibold text-foreground">
              {question.cardMeaning}
            </p>
          </div>
        </div>
      </div>

      {/* ── Answer buttons (shown after flip, before answer) ── */}
      {isFlipped && answerState === 'idle' && (
        <div className="flex w-full max-w-sm flex-col gap-2">
          <p className="text-center text-[11px] text-muted-foreground/50">
            {QUIZ_COPY.flipArrowHint}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onAnswer(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3.5 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-100"
            >
              <XIcon size={16} weight="bold" />
              {QUIZ_COPY.flipForgot}
            </button>
            <button
              onClick={() => onAnswer(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3.5 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-100"
            >
              <CheckIcon size={16} weight="bold" />
              {QUIZ_COPY.flipRemembered}
            </button>
          </div>
        </div>
      )}

      {/* ── Result feedback ── */}
      {answerState !== 'idle' && (
        <p className={`text-sm font-semibold ${answerState === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
          {answerState === 'correct' ? QUIZ_COPY.correctLabel : QUIZ_COPY.wrongLabel}
        </p>
      )}
    </div>
  )
}
