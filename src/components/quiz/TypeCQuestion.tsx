import { useState } from 'react'
import { SpeakerHighIcon, CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import { QUIZ_COPY } from '@/constants/quiz'
import type { QuizQuestion, AnswerState } from '@/types/quiz'

interface Props {
  question: QuizQuestion
  answerState: AnswerState
  selectedId: string | null
  onSelect: (choiceId: string, isCorrect: boolean) => void
}

export function TypeCQuestion({ question, answerState, selectedId, onSelect }: Props) {
  const [audioPlayed, setAudioPlayed] = useState(false)

  function handlePlay() {
    setAudioPlayed(true)
  }

  function choiceStyle(choice: { id: string; isCorrect: boolean }) {
    if (answerState === 'idle') {
      return selectedId === choice.id
        ? 'border-primary bg-primary/5 text-primary'
        : 'border-[#1d1c13]/10 bg-background text-foreground hover:border-primary/40 hover:bg-surface-container-low'
    }
    if (choice.isCorrect) return 'border-emerald-400 bg-emerald-50 text-emerald-700'
    if (choice.id === selectedId && !choice.isCorrect) return 'border-rose-400 bg-rose-50 text-rose-700'
    return 'border-[#1d1c13]/08 bg-surface-container-low/50 text-muted-foreground'
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Type label */}
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
          {QUIZ_COPY.typeLabelC}
        </span>
        <JlptBadge level={question.jlptLevel as any} />
        {question.isRetry && (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
            Ôn lại
          </span>
        )}
      </div>

      {/* Card display + audio */}
      <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low px-5 py-4">
        <div className="flex-1">
          <p className="font-kiwi text-3xl font-medium text-foreground">{question.cardContent}</p>
          {question.cardReading && (
            <p className="mt-0.5 text-sm text-muted-foreground">{question.cardReading}</p>
          )}
        </div>
        {question.audioUrl && (
          <button
            onClick={handlePlay}
            aria-label={audioPlayed ? QUIZ_COPY.replayAudio : QUIZ_COPY.playAudio}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              audioPlayed
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'bg-primary text-background hover:bg-primary-container'
            }`}
          >
            <SpeakerHighIcon size={18} weight={audioPlayed ? 'regular' : 'fill'} />
          </button>
        )}
      </div>

      {/* Prompt */}
      <p className="text-sm font-medium text-secondary">{QUIZ_COPY.promptC}</p>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-2">
        {(question.choices ?? []).map((choice) => (
          <button
            key={choice.id}
            disabled={answerState !== 'idle'}
            onClick={() => answerState === 'idle' && onSelect(choice.id, choice.isCorrect)}
            className={`relative flex items-start gap-2 rounded-2xl border p-3 text-left text-sm font-medium transition-all ${choiceStyle(choice)}`}
          >
            <span className="flex-1 leading-snug">{choice.label}</span>
            {answerState !== 'idle' && choice.isCorrect && (
              <CheckCircleIcon size={16} className="mt-0.5 shrink-0 text-emerald-500" />
            )}
            {answerState !== 'idle' && choice.id === selectedId && !choice.isCorrect && (
              <XCircleIcon size={16} className="mt-0.5 shrink-0 text-rose-500" />
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
