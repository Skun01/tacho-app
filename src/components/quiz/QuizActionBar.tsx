import { ArrowCounterClockwiseIcon, InfoIcon } from '@phosphor-icons/react'
import type { AnswerState } from '@/types/quiz'

interface Props {
  answerState: AnswerState
  showCardInfo: boolean
  isTypeC: boolean
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
  onUndo,
  onSeeAnswer,
  onShowCardInfo,
}: Props) {
  if (answerState === 'idle') return null

  return (
    <div
      className="fixed inset-x-0 z-30 flex justify-center gap-2 px-4"
      style={{ bottom: isTypeC ? '5rem' : '5.5rem' }}
    >
      <ActionBtn icon={<ArrowCounterClockwiseIcon size={12} />} onClick={onUndo}>
        Hoàn tác
      </ActionBtn>
      <ActionBtn icon={<InfoIcon size={12} />} onClick={onShowCardInfo}>
        {showCardInfo ? 'Thông tin thẻ ↓' : 'Xem thông tin thẻ'}
      </ActionBtn>
      {answerState === 'wrong' ? (
        <ActionBtn onClick={onSeeAnswer} highlight>
          ✓ Xem đáp án
        </ActionBtn>
      ) : (
        <ActionBtn disabled>= Không có alt.</ActionBtn>
      )}
    </div>
  )
}
