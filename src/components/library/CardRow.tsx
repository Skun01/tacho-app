import { Link } from 'react-router'
import { DotsSixVerticalIcon, XIcon } from '@phosphor-icons/react'
import { DECK_COPY } from '@/constants/deck'
import type { FlashCard } from '@/types/card'
import { TypeBadge } from '@/components/ui/type-badge'
import { JlptBadge } from '@/components/ui/jlpt-badge'

interface CardRowProps {
  card: FlashCard
  draggable?: boolean
  isDragOver?: boolean
  onDragStart?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
  onDragEnd?: () => void
  onRemove?: () => void
}

export function CardRow({
  card,
  draggable,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onRemove,
}: CardRowProps) {
  const detailPath = card.type === 'vocab' ? `/vocab/${card.id}` : `/grammar/${card.id}`

  return (
    <li
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 rounded-2xl bg-background px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] transition-all ${
        isDragOver ? 'scale-[1.01] ring-2 ring-primary/30' : ''
      }`}
    >
      {onRemove && (
        <DotsSixVerticalIcon
          size={16}
          className="shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing"
        />
      )}

      <Link
        to={detailPath}
        className="flex flex-1 min-w-0 items-center gap-3 transition-opacity hover:opacity-70"
        onClick={(e) => e.stopPropagation()}
      >
        <TypeBadge type={card.type} />
        <JlptBadge level={card.jlptLevel} />
        <span className="font-kiwi text-base font-medium text-foreground">{card.content}</span>
        {card.type === 'vocab' && card.reading && (
          <span className="text-xs text-muted-foreground">({card.reading})</span>
        )}
        <span className="ml-auto truncate text-xs text-muted-foreground">{card.meaning}</span>
      </Link>

      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label={DECK_COPY.editPage.removeCardAriaLabel}
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-500"
        >
          <XIcon size={13} />
        </button>
      )}
    </li>
  )
}
