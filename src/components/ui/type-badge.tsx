import { DECK_COPY } from '@/constants/deck'

interface TypeBadgeProps {
  type: 'vocab' | 'grammar'
}

const C = DECK_COPY.editPage

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        type === 'vocab' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
      }`}
    >
      {type === 'vocab' ? C.vocabLabel : C.grammarLabel}
    </span>
  )
}
