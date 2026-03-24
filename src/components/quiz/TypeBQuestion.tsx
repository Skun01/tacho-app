import { SpeakerHighIcon } from '@phosphor-icons/react'
import { FuriganaText } from '@/components/ui/furigana-text'
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

      {/* Instruction / result */}
      {answerState === 'idle' ? (
        <p className="text-sm text-muted-foreground">{QUIZ_COPY.promptB}</p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {/* Submitted sentence */}
          <p
            className={`font-kiwi text-2xl font-medium leading-relaxed ${
              answerState === 'correct' ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {submittedValue}
          </p>

          {/* Correct sentence on wrong */}
          {answerState === 'wrong' && (
            <p className="text-sm text-muted-foreground">
              {QUIZ_COPY.correctAnswerPrefix}{' '}
              <FuriganaText
                text={question.exampleSentence ?? question.acceptedAnswers[0]}
                className="font-kiwi font-semibold text-foreground"
              />
            </p>
          )}

          {/* Vietnamese meaning as context */}
          {question.exampleMeaning && (
            <p className="mt-1 text-sm italic text-muted-foreground">
              {question.exampleMeaning}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
