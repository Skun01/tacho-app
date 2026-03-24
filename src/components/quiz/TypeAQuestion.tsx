import { FuriganaText } from '@/components/ui/furigana-text'
import type { QuizQuestion, AnswerState } from '@/types/quiz'

interface Props {
  question: QuizQuestion
  answerState: AnswerState
  submittedValue: string
  hint?: string
}

export function TypeAQuestion({ question, answerState, submittedValue, hint }: Props) {
  const answerColorClass =
    answerState === 'correct'
      ? 'text-emerald-600 border-emerald-500'
      : answerState === 'wrong'
        ? 'text-rose-600 border-rose-500'
        : ''

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {question.promptSentence ? (
        <p className="font-kiwi text-4xl leading-[2.4] tracking-wide text-foreground">
          {question.promptSentence.split('___').map((part, i, arr) => (
            <span key={i}>
              <FuriganaText text={part} />
              {i < arr.length - 1 &&
                (answerState === 'idle' ? (
                  <span className="mx-2 inline-block min-w-[5rem] border-b-2 border-foreground/30 align-bottom" />
                ) : (
                  <span className={`mx-0.5 border-b-2 font-medium ${answerColorClass}`}>
                    {submittedValue || '—'}
                  </span>
                ))}
            </span>
          ))}
        </p>
      ) : (
        <p className="text-xl font-semibold leading-relaxed text-foreground">
          {question.promptLabel}
        </p>
      )}

      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {question.cardMeaning}
      </p>

      {answerState === 'wrong' && hint && (
        <p className="text-sm text-amber-600">
          Gợi ý: <span className="font-medium">{hint}</span>
        </p>
      )}
    </div>
  )
}
