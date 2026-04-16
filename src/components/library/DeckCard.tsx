import {
  BookmarkIcon,
  BookmarkSimpleIcon,
  LockSimpleIcon,
  PencilSimpleIcon,
  StackSimpleIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LIBRARY_COPY } from '@/constants/library'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import { cn } from '@/lib/utils'
import type { DeckListItemResponse } from '@/types/deck'

const COVER_GRADIENTS = [
  'from-[#d4e0f5] to-[#c8dde2]',
  'from-rose-100 to-pink-100',
  'from-amber-100 to-orange-50',
  'from-violet-100 to-purple-50',
  'from-emerald-50 to-teal-100',
  'from-yellow-50 to-amber-100',
] as const

interface DeckCardProps {
  deck: DeckListItemResponse
  onOpen: (deckId: string) => void
  onToggleBookmark?: (deck: DeckListItemResponse) => void
  onManage?: (deckId: string) => void
  isBookmarkPending?: boolean
  emphasizeOfficial?: boolean
}

export function DeckCard({
  deck,
  onOpen,
  onToggleBookmark,
  onManage,
  isBookmarkPending = false,
  emphasizeOfficial = false,
}: DeckCardProps) {
  const coverUrl = resolveMediaUrl(deck.coverImageUrl)
  const gradient = COVER_GRADIENTS[Math.abs(deck.id.length) % COVER_GRADIENTS.length]

  return (
    <div
      onClick={() => onOpen(deck.id)}
      className={cn(
        'group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-background transition-shadow hover:shadow-[0_4px_20px_0_rgba(29,28,19,0.12)]',
        emphasizeOfficial
          ? 'ring-1 ring-primary/15 shadow-[0_6px_24px_0_rgba(0,36,83,0.10)]'
          : 'shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]',
      )}
    >
      <div
        className={cn(
          'relative h-28 bg-gradient-to-br',
          emphasizeOfficial ? 'from-[#cfe0ff] via-[#e9f1ff] to-[#f5f9ff]' : gradient,
        )}
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt={deck.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <button
          type="button"
          disabled={isBookmarkPending}
          onClick={(event) => {
            event.stopPropagation()
            onToggleBookmark?.(deck)
          }}
          aria-label={LIBRARY_COPY.bookmarkAriaLabel}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/70 transition-colors hover:bg-background disabled:opacity-60"
        >
          {deck.isBookmarked ? (
            <BookmarkSimpleIcon size={14} weight="fill" className="text-primary" />
          ) : (
            <BookmarkIcon size={14} className="text-muted-foreground" />
          )}
        </button>

        {deck.isOfficial && (
          <span
            className={cn(
              'absolute bottom-2 left-3 rounded-full px-2 py-0.5 text-[10px] font-semibold',
              emphasizeOfficial
                ? 'bg-primary text-background shadow-sm'
                : 'bg-primary/90 text-background',
            )}
          >
            {emphasizeOfficial ? LIBRARY_COPY.officialBadge : LIBRARY_COPY.systemBadge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {deck.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {deck.isOfficial
            ? LIBRARY_COPY.editorLabel
            : `${LIBRARY_COPY.createdByPrefix} ${deck.createdBy.username}`}
        </p>

        {emphasizeOfficial && (
          <p className="text-[11px] font-medium text-primary/80">
            {LIBRARY_COPY.systemTabHint}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {deck.type.name && (
            <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-muted-foreground">
              {deck.type.name}
            </span>
          )}
          <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-muted-foreground">
            {LIBRARY_COPY.cardCount(deck.cardsCount)}
          </span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
            <StackSimpleIcon size={12} />
            {deck.foldersCount}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {deck.visibility === 'Private' && !deck.isOwner ? (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <LockSimpleIcon size={12} />
              {LIBRARY_COPY.privateLabel}
            </span>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              {deck.visibility === 'Private'
                ? LIBRARY_COPY.privateLabel
                : LIBRARY_COPY.publicLabel}
            </Badge>
          )}

          {deck.isOwner && onManage && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={(event) => {
                event.stopPropagation()
                onManage(deck.id)
              }}
              className="h-7 rounded-lg px-2 text-xs"
            >
              <PencilSimpleIcon size={12} />
              {LIBRARY_COPY.actions.editDeck}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
