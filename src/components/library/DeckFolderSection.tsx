import {
  CaretDownIcon,
  CaretUpIcon,
  PencilSimpleIcon,
  PlusIcon,
  DotsSixVerticalIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeckDetailCardRow } from '@/components/library/DeckDetailCardRow'
import { DECK_COPY } from '@/constants/deck'
import type { DeckFolderResponse } from '@/types/deck'

interface DeckFolderSectionProps {
  folder: DeckFolderResponse
  isOwner?: boolean
  searchQuery?: string
  draggable?: boolean
  isDragOver?: boolean
  onDragStart?: () => void
  onDragOver?: (event: React.DragEvent<HTMLElement>) => void
  onDrop?: () => void
  onDragEnd?: () => void
  onEdit?: (folderId: string) => void
  onDelete?: (folderId: string) => void
  onAddCard?: (folderId: string) => void
  onRemoveCard?: (folderId: string, cardId: string) => void
  onDragCardStart?: (cardId: string) => void
  onDragCardOver?: (cardId: string) => void
  onDropCard?: (cardId: string) => void
  onDragCardEnd?: () => void
  draggedCardId?: string | null
  dragOverCardId?: string | null
}

export function DeckFolderSection({
  folder,
  isOwner = false,
  searchQuery = '',
  draggable = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onEdit,
  onDelete,
  onAddCard,
  onRemoveCard,
  onDragCardStart,
  onDragCardOver,
  onDropCard,
  onDragCardEnd,
  draggedCardId = null,
  dragOverCardId = null,
}: DeckFolderSectionProps) {
  const [expanded, setExpanded] = useState(true)
  const sortedCards = useMemo(
    () => [...folder.cards].sort((left, right) => left.position - right.position),
    [folder.cards],
  )
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const visibleCards = useMemo(() => {
    if (!normalizedQuery) return sortedCards

    return sortedCards.filter((item) => {
      const alternateForms = item.card.alternateForms?.join(' ') ?? ''
      return [
        item.card.title,
        item.card.summary,
        alternateForms,
        item.card.level ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [normalizedQuery, sortedCards])

  return (
    <section
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex flex-col gap-3 ${isDragOver ? 'scale-[1.01]' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-background p-5 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {isOwner && (
              <span title={DECK_COPY.dragFolder}>
                <DotsSixVerticalIcon
                  size={16}
                  className={`hidden text-muted-foreground/35 lg:block ${
                    draggable ? 'cursor-grab active:cursor-grabbing' : ''
                  }`}
                />
              </span>
            )}
            <h2 className="text-lg font-bold text-foreground">{folder.title}</h2>
            <Badge variant="outline">{folder.cardsCount} thẻ</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {folder.description || DECK_COPY.emptyCards}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpanded((value) => !value)}
            title={expanded ? DECK_COPY.collapseFolder : DECK_COPY.expandFolder}
          >
            {expanded ? <CaretUpIcon size={16} /> : <CaretDownIcon size={16} />}
          </Button>

          {isOwner && onAddCard && (
            <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => onAddCard(folder.id)}>
              <PlusIcon size={16} />
              {DECK_COPY.addCard}
            </Button>
          )}

          {isOwner && (
            <div className="flex items-center gap-1 rounded-full border border-border/70 bg-surface-container-low px-1.5 py-1">
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onEdit(folder.id)}
                  title={DECK_COPY.editFolder}
                >
                  <PencilSimpleIcon size={12} />
                </Button>
              )}
              {onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onDelete(folder.id)}
                  title={DECK_COPY.deleteFolder}
                  className="text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
                >
                  <TrashIcon size={12} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="space-y-2">
          {visibleCards.length === 0 ? (
            <div className="rounded-2xl bg-background px-4 py-8 text-center text-sm text-muted-foreground shadow-[0_1px_6px_0_rgba(29,28,19,0.06)]">
              {DECK_COPY.emptyCards}
            </div>
          ) : (
            visibleCards.map((item) => (
              <DeckDetailCardRow
                key={item.cardId}
                item={item}
                isOwner={isOwner}
                draggable={isOwner && !normalizedQuery}
                isDragOver={dragOverCardId === item.cardId && draggedCardId !== item.cardId}
                onDragStart={
                  isOwner && !normalizedQuery && onDragCardStart
                    ? () => onDragCardStart(item.cardId)
                    : undefined
                }
                onDragOver={
                  isOwner && !normalizedQuery && onDragCardOver
                    ? (event) => {
                        event.preventDefault()
                        onDragCardOver(item.cardId)
                      }
                    : undefined
                }
                onDrop={
                  isOwner && !normalizedQuery && onDropCard
                    ? () => onDropCard(item.cardId)
                    : undefined
                }
                onDragEnd={isOwner && !normalizedQuery ? onDragCardEnd : undefined}
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
