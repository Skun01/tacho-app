import { CaretDownIcon, CaretUpIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeckDetailCardRow } from '@/components/library/DeckDetailCardRow'
import { DECK_COPY } from '@/constants/deck'
import type { DeckFolderResponse } from '@/types/deck'

interface DeckFolderSectionProps {
  folder: DeckFolderResponse
  isOwner?: boolean
  onEdit?: (folderId: string) => void
  onDelete?: (folderId: string) => void
  onAddCard?: (folderId: string) => void
  onRemoveCard?: (folderId: string, cardId: string) => void
  onMoveFolder?: (folderId: string, direction: 'up' | 'down') => void
  onMoveCard?: (folderId: string, cardId: string, direction: 'up' | 'down') => void
  isFirstFolder?: boolean
  isLastFolder?: boolean
}

export function DeckFolderSection({
  folder,
  isOwner = false,
  onEdit,
  onDelete,
  onAddCard,
  onRemoveCard,
  onMoveFolder,
  onMoveCard,
  isFirstFolder = false,
  isLastFolder = false,
}: DeckFolderSectionProps) {
  const [expanded, setExpanded] = useState(true)
  const sortedCards = useMemo(
    () => [...folder.cards].sort((left, right) => left.position - right.position),
    [folder.cards],
  )

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-background p-5 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">{folder.title}</h2>
            <Badge variant="outline">{folder.cardsCount} thẻ</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {folder.description || DECK_COPY.emptyCards}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <CaretUpIcon size={16} /> : <CaretDownIcon size={16} />}
          </Button>
          {isOwner && onMoveFolder && (
            <>
              <Button type="button" variant="outline" size="sm" disabled={isFirstFolder} onClick={() => onMoveFolder(folder.id, 'up')}>
                <CaretUpIcon size={16} />
                {DECK_COPY.moveUp}
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={isLastFolder} onClick={() => onMoveFolder(folder.id, 'down')}>
                <CaretDownIcon size={16} />
                {DECK_COPY.moveDown}
              </Button>
            </>
          )}
          {isOwner && onAddCard && (
            <Button type="button" variant="outline" size="sm" onClick={() => onAddCard(folder.id)}>
              <PlusIcon size={16} />
              {DECK_COPY.addCard}
            </Button>
          )}
          {isOwner && onEdit && (
            <Button type="button" variant="outline" size="sm" onClick={() => onEdit(folder.id)}>
              <PencilSimpleIcon size={16} />
              {DECK_COPY.editFolder}
            </Button>
          )}
          {isOwner && onDelete && (
            <Button type="button" variant="outline" size="sm" onClick={() => onDelete(folder.id)}>
              <TrashIcon size={16} />
              {DECK_COPY.deleteFolder}
            </Button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="space-y-2">
          {sortedCards.length === 0 ? (
            <div className="rounded-2xl bg-background px-4 py-8 text-center text-sm text-muted-foreground shadow-[0_1px_6px_0_rgba(29,28,19,0.06)]">
              {DECK_COPY.emptyCards}
            </div>
          ) : (
            sortedCards.map((item, index) => (
              <DeckDetailCardRow
                key={item.cardId}
                item={item}
                isOwner={isOwner}
                isFirst={index === 0}
                isLast={index === sortedCards.length - 1}
                onMoveUp={
                  isOwner && onMoveCard
                    ? () => onMoveCard(folder.id, item.cardId, 'up')
                    : undefined
                }
                onMoveDown={
                  isOwner && onMoveCard
                    ? () => onMoveCard(folder.id, item.cardId, 'down')
                    : undefined
                }
                onRemove={
                  isOwner && onRemoveCard
                    ? () => onRemoveCard(folder.id, item.cardId)
                    : undefined
                }
              />
            ))
          )}
        </div>
      )}
    </section>
  )
}
