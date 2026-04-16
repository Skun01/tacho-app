import { BookOpenIcon, CaretDownIcon, CaretUpIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

function getCardPath(cardType: string, cardId: string) {
  if (cardType === 'Vocab') return `/vocabulary/${cardId}`
  if (cardType === 'Grammar') return `/grammar/${cardId}`
  return `/kanji/${cardId}`
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
    <Card className="rounded-3xl border-border/70 bg-card/90">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl">{folder.title}</CardTitle>
            <CardDescription className="text-sm leading-6">
              {folder.description || DECK_COPY.emptyCards}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{folder.cardsCount} thẻ</Badge>
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
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-3">
          {sortedCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
              {DECK_COPY.emptyCards}
            </div>
          ) : (
            sortedCards.map((item, index) => (
              <div
                key={item.cardId}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{item.card.cardType}</Badge>
                    {item.card.level && <Badge variant="outline">{item.card.level}</Badge>}
                  </div>
                  <a
                    href={getCardPath(item.card.cardType, item.card.id)}
                    className="block truncate text-base font-semibold text-foreground hover:text-primary"
                  >
                    {item.card.title}
                  </a>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.card.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <a href={getCardPath(item.card.cardType, item.card.id)}>
                      <BookOpenIcon size={16} />
                      Mở thẻ
                    </a>
                  </Button>
                  {isOwner && onMoveCard && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => onMoveCard(folder.id, item.cardId, 'up')}
                      >
                        <CaretUpIcon size={16} />
                        {DECK_COPY.moveUp}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === sortedCards.length - 1}
                        onClick={() => onMoveCard(folder.id, item.cardId, 'down')}
                      >
                        <CaretDownIcon size={16} />
                        {DECK_COPY.moveDown}
                      </Button>
                    </>
                  )}
                  {isOwner && onRemoveCard && (
                    <Button type="button" variant="outline" size="sm" onClick={() => onRemoveCard(folder.id, item.cardId)}>
                      <TrashIcon size={16} />
                      {DECK_COPY.removeCard}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      )}
    </Card>
  )
}

