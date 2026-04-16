import { MagnifyingGlassIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DECK_COPY } from '@/constants/deck'
import { useCardSearch } from '@/hooks/useCardSearch'

interface AddCardSearchPanelProps {
  isPending?: boolean
  variant?: 'panel' | 'modal'
  existingCardFolderMap?: Record<string, string>
  onClose: () => void
  onAddCard: (cardId: string) => void
  onRemoveCard?: (cardId: string, folderId: string) => void
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

export function AddCardSearchPanel({
  isPending = false,
  variant = 'panel',
  existingCardFolderMap = {},
  onClose,
  onAddCard,
  onRemoveCard,
}: AddCardSearchPanelProps) {
  const [query, setQuery] = useState('')
  const { data, isFetching } = useCardSearch(
    {
      q: query,
      page: 1,
      pageSize: 10,
    },
    Boolean(query.trim()),
  )

  const items = data?.data ?? []
  const isModal = variant === 'modal'

  return (
    <div className={isModal ? 'p-0' : 'rounded-3xl border border-border/70 bg-card/90 p-6'}>
      <div className={isModal ? 'border-b border-[#1d1c13]/8 px-6 py-4' : 'mb-6 space-y-1'}>
        <h2 className={isModal ? 'text-base font-bold text-foreground' : 'text-xl font-semibold text-foreground'}>
          {DECK_COPY.addCard}
        </h2>
        {!isModal && (
          <p className="text-sm text-muted-foreground">{DECK_COPY.searchCardPlaceholder}</p>
        )}
      </div>

      <div className={isModal ? 'relative px-6 pt-6' : 'relative mb-5'}>
        <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border/70 bg-background px-3 shadow-[0_1px_8px_0_rgba(29,28,19,0.06)]">
          <MagnifyingGlassIcon className="shrink-0 text-muted-foreground" size={16} />
          <Input
            autoFocus={isModal}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={DECK_COPY.searchAddableCardsPlaceholder}
            className="h-11 rounded-none border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
          />
          {query.trim() && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setQuery('')}
              aria-label={DECK_COPY.clearSearch}
              title={DECK_COPY.clearSearch}
            >
              <XIcon size={12} />
            </Button>
          )}
        </div>
      </div>

      <div className={isModal ? 'max-h-[60vh] space-y-3 overflow-y-auto px-6 py-5' : 'space-y-3'}>
        {!query.trim() ? (
          <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
            {DECK_COPY.addCardEmpty}
          </div>
        ) : isFetching ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
            {DECK_COPY.cardSearchEmpty}
          </div>
        ) : (
          items.map((item) => {
            const detailPath = getCardPath(item.cardType, item.id)
            const alternateForms = item.alternateForms?.join(' ・ ') ?? ''
            const existingFolderId = existingCardFolderMap[item.id]
            const isAdded = Boolean(existingFolderId)

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3 shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] transition-all hover:shadow-[0_4px_14px_0_rgba(29,28,19,0.08)]"
              >
                <Link
                  to={detailPath}
                  className="flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-75"
                >
                  <Badge
                    variant="outline"
                    className={`w-20 justify-center ${getCardTypeClassName(item.cardType)}`}
                  >
                    {DECK_COPY.cardTypeLabels[item.cardType]}
                  </Badge>
                  {item.level && (
                    <Badge
                      variant="outline"
                      className={`w-11 justify-center ${getLevelClassName()}`}
                    >
                      {item.level}
                    </Badge>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-[15px] font-semibold text-foreground">
                        {item.title}
                      </span>
                      {alternateForms && (
                        <span className="hidden truncate text-xs text-muted-foreground md:block">
                          ({alternateForms})
                        </span>
                      )}
                    </div>
                    {item.summary && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </Link>

                <Button
                  type="button"
                  size={isAdded ? 'sm' : 'icon-sm'}
                  disabled={isPending}
                  onClick={() => {
                    if (isAdded && existingFolderId && onRemoveCard) {
                      onRemoveCard(item.id, existingFolderId)
                      return
                    }

                    onAddCard(item.id)
                  }}
                  variant={isAdded ? 'secondary' : 'default'}
                  className={`shrink-0 ${isAdded ? 'rounded-full px-3 text-xs font-semibold' : 'rounded-full'}`}
                  aria-label={isAdded ? DECK_COPY.removeCard : DECK_COPY.addCard}
                  title={isAdded ? DECK_COPY.removeCard : DECK_COPY.addCard}
                >
                  {isAdded ? (
                    DECK_COPY.removeCard
                  ) : (
                    <PlusIcon size={14} weight="bold" />
                  )}
                </Button>
              </div>
            )
          })
        )}
      </div>

      <div className={isModal ? 'flex justify-end border-t border-[#1d1c13]/8 px-6 py-4' : 'mt-5 flex justify-end'}>
        <Button type="button" variant={isModal ? 'secondary' : 'outline'} onClick={onClose}>
          {DECK_COPY.cancel}
        </Button>
      </div>
    </div>
  )
}
