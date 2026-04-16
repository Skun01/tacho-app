import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DECK_COPY } from '@/constants/deck'
import { useCardSearch } from '@/hooks/useCardSearch'

interface AddCardSearchPanelProps {
  isPending?: boolean
  onClose: () => void
  onAddCard: (cardId: string) => void
}

function getCardPath(cardType: string, cardId: string) {
  if (cardType === 'Vocab') return `/vocabulary/${cardId}`
  if (cardType === 'Grammar') return `/grammar/${cardId}`
  return `/kanji/${cardId}`
}

export function AddCardSearchPanel({
  isPending = false,
  onClose,
  onAddCard,
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

  return (
    <div className="rounded-3xl border border-border/70 bg-card/90 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold text-foreground">{DECK_COPY.addCard}</h2>
        <p className="text-sm text-muted-foreground">{DECK_COPY.searchCardPlaceholder}</p>
      </div>

      <div className="relative mb-5">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={DECK_COPY.searchCardPlaceholder}
          className="h-11 rounded-2xl bg-background pl-10"
        />
      </div>

      <div className="space-y-3">
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
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-surface-container px-2 py-1">{item.cardType}</span>
                  {item.level && <span className="rounded-full bg-surface-container px-2 py-1">{item.level}</span>}
                </div>
                <a href={getCardPath(item.cardType, item.id)} className="block text-base font-semibold text-foreground hover:text-primary">
                  {item.title}
                </a>
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
              </div>

              <Button type="button" size="sm" disabled={isPending} onClick={() => onAddCard(item.id)}>
                <PlusIcon size={16} />
                {DECK_COPY.addCard}
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          {DECK_COPY.cancel}
        </Button>
      </div>
    </div>
  )
}
