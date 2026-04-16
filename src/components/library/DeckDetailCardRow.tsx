import { Link } from 'react-router'
import {
  BookOpenIcon,
  CaretDownIcon,
  CaretUpIcon,
  DotsSixVerticalIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DECK_COPY } from '@/constants/deck'
import type { DeckFolderCardItemResponse } from '@/types/deck'

interface DeckDetailCardRowProps {
  item: DeckFolderCardItemResponse
  isOwner?: boolean
  isFirst?: boolean
  isLast?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onRemove?: () => void
}

function getCardPath(cardType: string, cardId: string) {
  if (cardType === 'Vocab') return `/vocabulary/${cardId}`
  if (cardType === 'Grammar') return `/grammar/${cardId}`
  return `/kanji/${cardId}`
}

function getCardTypeClassName(cardType: string) {
  if (cardType === 'Vocab') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (cardType === 'Grammar') {
    return 'border-sky-200 bg-sky-50 text-sky-700'
  }

  return 'border-violet-200 bg-violet-50 text-violet-700'
}

function getLevelClassName() {
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

export function DeckDetailCardRow({
  item,
  isOwner = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onRemove,
}: DeckDetailCardRowProps) {
  const detailPath = getCardPath(item.card.cardType, item.card.id)
  const alternateForms = item.card.alternateForms?.join(' ・ ') ?? ''
  const summary = item.card.summary?.trim()
  const showRemoveButton = isOwner && Boolean(onRemove)
  const showMoveButtons = isOwner && Boolean(onMoveUp) && Boolean(onMoveDown)

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] transition-all hover:shadow-[0_4px_14px_0_rgba(29,28,19,0.08)]">
      {showRemoveButton && (
        <DotsSixVerticalIcon
          size={16}
          className="hidden shrink-0 text-muted-foreground/35 lg:block"
        />
      )}

      <Link
        to={detailPath}
        className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-75"
      >
        <Badge
          variant="outline"
          className={`w-20 justify-center ${getCardTypeClassName(item.card.cardType)}`}
        >
          {DECK_COPY.cardTypeLabels[item.card.cardType]}
        </Badge>
        {item.card.level && (
          <Badge
            variant="outline"
            className={`w-11 justify-center ${getLevelClassName()}`}
          >
            {item.card.level}
          </Badge>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[15px] font-semibold text-foreground">
              {item.card.title}
            </span>
            {alternateForms && (
              <span className="hidden truncate text-xs text-muted-foreground md:block">
                ({alternateForms})
              </span>
            )}
          </div>
          {summary && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {summary}
            </p>
          )}
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          asChild
          aria-label={DECK_COPY.openCardAriaLabel}
        >
          <Link to={detailPath}>
            <BookOpenIcon size={12} />
          </Link>
        </Button>

        {showMoveButtons && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={isFirst}
              onClick={onMoveUp}
              aria-label={DECK_COPY.moveUp}
            >
              <CaretUpIcon size={12} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={isLast}
              onClick={onMoveDown}
              aria-label={DECK_COPY.moveDown}
            >
              <CaretDownIcon size={12} />
            </Button>
          </>
        )}

        {showRemoveButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            aria-label={DECK_COPY.removeCardAriaLabel}
            className="text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
          >
            <TrashIcon size={12} />
          </Button>
        )}
      </div>
    </div>
  )
}
