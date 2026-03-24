import type { RefObject, MutableRefObject } from 'react'
import { ArrowRightIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import { useWanakana } from '@/hooks/useWanakana'
import { QUIZ_COPY } from '@/constants/quiz'
import type { AnswerState } from '@/types/quiz'

interface Props {
  isTypeC: boolean
  isTypeD: boolean
  answerState: AnswerState
  inputValue: string
  inputRef: RefObject<HTMLInputElement | null>
  audioUrl: string | undefined
  canSubmit: boolean
  skipNextEnterRef: MutableRefObject<boolean>
  onChange: (value: string) => void
  onCheck: () => void
  onNext: () => void
  onPlayAudio: () => void
}

export function QuizInputBar({
  isTypeC,
  isTypeD,
  answerState,
  inputValue,
  inputRef,
  audioUrl,
  canSubmit,
  skipNextEnterRef,
  onChange,
  onCheck,
  onNext,
  onPlayAudio,
}: Props) {
  useWanakana(inputRef, { active: answerState === 'idle' })

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

  if (isTypeD) {
    if (answerState === 'idle') return null
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6">
        <button
          onClick={onNext}
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
    )
  }

  if (isTypeC) {
    if (answerState === 'idle') return null
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6">
        <button
          onClick={onNext}
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
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6 pt-2">
      <div
        className={`mx-auto flex max-w-xl items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-sm transition-all duration-200 ${barBorderClass}`}
      >
        <button
          disabled={!audioUrl}
          onClick={onPlayAudio}
          aria-label={QUIZ_COPY.playAudio}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
            audioUrl
              ? 'text-secondary hover:bg-surface-container'
              : 'text-muted-foreground/25'
          }`}
        >
          <SpeakerHighIcon size={15} weight="fill" />
        </button>

        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => answerState === 'idle' && onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && answerState === 'idle' && inputValue.trim()) {
              skipNextEnterRef.current = true
              onCheck()
            }
          }}
          readOnly={answerState !== 'idle'}
          placeholder={QUIZ_COPY.inputPlaceholder}
          className={`flex-1 bg-transparent font-kiwi text-lg outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/40 ${inputTextClass}`}
        />

        <button
          onClick={answerState === 'idle' ? onCheck : onNext}
          disabled={answerState === 'idle' && !canSubmit}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${arrowClass}`}
        >
          <ArrowRightIcon size={15} />
        </button>
      </div>
    </div>
  )
}
