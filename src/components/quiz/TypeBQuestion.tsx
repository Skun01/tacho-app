import { SpeakerHighIcon } from '@phosphor-icons/react'
import { QUIZ_COPY } from '@/constants/quiz'
import type { QuizQuestion, AnswerState } from '@/types/quiz'

interface Props {
  question: QuizQuestion
  answerState: AnswerState
  submittedValue: string
  hasPlayed: boolean
  onPlay: () => void
}

export function TypeBQuestion({ question, answerState, submittedValue, hasPlayed, onPlay }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* Big audio button */}
      <button
        onClick={onPlay}
        aria-label={hasPlayed ? QUIZ_COPY.replayAudio : QUIZ_COPY.playAudio}
        className={`flex h-24 w-24 items-center justify-center rounded-full transition-all ${
          hasPlayed
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : 'bg-primary text-background shadow-xl hover:bg-primary-container'
        }`}
      >
        <SpeakerHighIcon size={44} weight="fill" />
      </button>

      {/* Instruction when idle; result when answered */}
      {answerState === 'idle' ? (
        <p className="text-sm text-muted-foreground">{QUIZ_COPY.promptB}</p>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p
            className={`font-kiwi text-3xl font-medium ${
              answerState === 'correct' ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {submittedValue}
          </p>
          {answerState === 'wrong' && (
            <p className="text-sm text-muted-foreground">
              {QUIZ_COPY.correctAnswerPrefix}{' '}
              <span className="font-kiwi font-semibold text-foreground">
                {question.acceptedAnswers.join(' / ')}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
