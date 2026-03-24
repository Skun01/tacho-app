import { useState } from 'react'
import { FuriganaText } from '@/components/ui/furigana-text'
import type { QuizQuestion, AnswerState } from '@/types/quiz'

interface Props {
  question: QuizQuestion
  answerState: AnswerState
  submittedValue: string
  showHint?: boolean
}

function splitAroundKeyword(
  text: string,
  keyword: string,
): [string, string, string] | null {
  const idx = text.toLowerCase().indexOf(keyword.toLowerCase())
  if (idx === -1) return null
  return [
    text.slice(0, idx),
    text.slice(idx, idx + keyword.length),
    text.slice(idx + keyword.length),
  ]
}

export function TypeAQuestion({ question, answerState, submittedValue, showHint }: Props) {
  const [hintHovered, setHintHovered] = useState(false)

  const answerColorClass =
    answerState === 'correct'
      ? 'text-emerald-600 border-emerald-500'
      : answerState === 'wrong'
        ? 'text-rose-600 border-rose-500'
        : ''

  const highlightKey = question.promptKeyword ?? question.cardMeaning
  const parts = question.promptMeaning
    ? splitAroundKeyword(question.promptMeaning, highlightKey)
    : null

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

      {/* Extra hint panel: cardMeaning revealed via toggle button */}
      {showHint && question.promptKeyword && (
        <p className="max-w-sm rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
          {question.cardMeaning}
        </p>
      )}

      {/* Hint: sentence meaning — highlightKey unblurred, rest blur until hover */}
      <p
        className="max-w-sm cursor-default text-sm leading-relaxed text-secondary"
        onMouseEnter={() => setHintHovered(true)}
        onMouseLeave={() => setHintHovered(false)}
      >
        {question.promptMeaning ? (
          parts ? (
            <>
              {parts[0] && (
                <span
                  className={`transition-all duration-200 ${
                    hintHovered ? '' : 'blur-sm select-none'
                  }`}
                >
                  {parts[0]}
                </span>
              )}
              <span className="font-semibold text-foreground">{parts[1]}</span>
              {parts[2] && (
                <span
                  className={`transition-all duration-200 ${
                    hintHovered ? '' : 'blur-sm select-none'
                  }`}
                >
                  {parts[2]}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="font-semibold text-foreground">{question.cardMeaning}</span>
              <span
                className={`ml-1 transition-all duration-200 ${
                  hintHovered ? '' : 'blur-sm select-none'
                }`}
              >
                — {question.promptMeaning}
              </span>
            </>
          )
        ) : (
          question.cardMeaning
        )}
      </p>
    </div>
  )
}
