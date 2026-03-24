import { ArrowCounterClockwiseIcon, InfoIcon } from '@phosphor-icons/react'
import type { AnswerState } from '@/types/quiz'
import { QUIZ_COPY } from '@/constants/quiz'

const C = QUIZ_COPY

interface Props {
  answerState: AnswerState
  showCardInfo: boolean
  isTypeC: boolean
  isTypeD: boolean
  onUndo: () => void
  onSeeAnswer: () => void
  onShowCardInfo: () => void
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

export function QuizActionBar({
  answerState,
  showCardInfo,
  isTypeC,
  isTypeD,
  onUndo,
  onSeeAnswer,
  onShowCardInfo,
}: Props) {
  if (answerState === 'idle') return null

  return (
    <div
      className={`fixed inset-x-0 z-30 flex justify-center gap-2 px-4 ${
        isTypeC || isTypeD ? 'bottom-20' : 'bottom-22'
      }`}
    >
      <ActionBtn icon={<ArrowCounterClockwiseIcon size={12} />} onClick={onUndo}>
        {C.actionUndo}
      </ActionBtn>
      <ActionBtn icon={<InfoIcon size={12} />} onClick={onShowCardInfo}>
        {showCardInfo ? C.actionCardInfoHide : C.actionCardInfo}
      </ActionBtn>
      {!isTypeD && (
        answerState === 'wrong' ? (
          <ActionBtn onClick={onSeeAnswer} highlight>
            {C.actionSeeAnswer}
          </ActionBtn>
        ) : (
          <ActionBtn disabled>{C.actionNoAlt}</ActionBtn>
        )
      )}
    </div>
  )
}
