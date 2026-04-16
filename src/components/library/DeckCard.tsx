import {
  BookmarkIcon,
  BookmarkSimpleIcon,
  BookOpenIcon,
  LockSimpleIcon,
  LockKeyOpenIcon,
} from '@phosphor-icons/react'
import { LIBRARY_COPY } from '@/constants/library'
import { resolveMediaUrl } from '@/lib/mediaUrl'
import { cn } from '@/lib/utils'
import type { DeckListItemResponse } from '@/types/deck'

const COVER_GRADIENTS = [
  'from-[#d4e0f5] to-[#c8dde2] dark:from-[#24324b] dark:to-[#1f3a44]',
  'from-rose-100 to-pink-100 dark:from-[#482632] dark:to-[#3c2433]',
  'from-amber-100 to-orange-50 dark:from-[#4a3620] dark:to-[#3d2818]',
  'from-violet-100 to-purple-50 dark:from-[#352b4f] dark:to-[#2d2544]',
  'from-emerald-50 to-teal-100 dark:from-[#1f413d] dark:to-[#1d3640]',
  'from-yellow-50 to-amber-100 dark:from-[#453c1f] dark:to-[#40311b]',
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
        'group flex h-auto self-start cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow hover:shadow-[0_4px_20px_0_rgba(29,28,19,0.12)] dark:bg-surface-container-high dark:hover:shadow-[0_10px_28px_0_rgba(0,0,0,0.34)]',
        emphasizeOfficial
          ? 'ring-1 ring-primary/20 shadow-[0_6px_24px_0_rgba(0,36,83,0.10)] dark:shadow-[0_10px_30px_0_rgba(20,34,73,0.35)]'
          : 'shadow-[0_2px_12px_0_rgba(29,28,19,0.07)] dark:shadow-[0_8px_22px_0_rgba(0,0,0,0.24)]',
      )}
    >
      <div
        className={cn(
          'relative h-32 bg-gradient-to-br',
          emphasizeOfficial
            ? 'from-[#cfe0ff] via-[#e9f1ff] to-[#f5f9ff] dark:from-[#233657] dark:via-[#203149] dark:to-[#1f293b]'
            : gradient,
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
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-background/80 backdrop-blur-sm transition-colors hover:bg-background disabled:opacity-60 dark:border-white/10 dark:bg-surface-container-highest/85 dark:hover:bg-surface-container-highest"
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
                ? 'bg-primary text-background shadow-sm dark:bg-primary/90 dark:text-primary-foreground'
                : 'bg-primary/90 text-background dark:bg-primary/80 dark:text-primary-foreground',
            )}
          >
            {emphasizeOfficial ? LIBRARY_COPY.officialBadge : LIBRARY_COPY.systemBadge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground">
          {deck.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {deck.isOfficial
            ? LIBRARY_COPY.editorLabel
            : `${LIBRARY_COPY.createdByPrefix} ${deck.createdBy.username}`}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {deck.type.name && (
            <span className="rounded-full border border-border/60 bg-surface-container-high px-2 py-0.5 text-[10px] text-muted-foreground dark:bg-surface-container-highest">
              {deck.type.name}
            </span>
          )}
          <span className="rounded-full border border-border/60 bg-surface-container-high px-2 py-0.5 text-[10px] text-muted-foreground dark:bg-surface-container-highest">
            {deck.cardsCount} {LIBRARY_COPY.cardCountSuffix}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
              deck.visibility === 'Private'
                ? 'bg-amber-100 text-amber-700 dark:border dark:border-amber-500/30 dark:bg-amber-500/18 dark:text-amber-200'
                : 'bg-emerald-100 text-emerald-700 dark:border dark:border-emerald-500/30 dark:bg-emerald-500/18 dark:text-emerald-200',
            )}
          >
            {deck.visibility === 'Private' ? <LockSimpleIcon size={11} /> : <LockKeyOpenIcon size={11} />}
            {deck.visibility === 'Private' ? LIBRARY_COPY.privateLabel : LIBRARY_COPY.publicLabel}
          </span>

          {deck.isOwner && onManage ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onManage(deck.id)
              }}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-surface-container-high dark:hover:bg-surface-container-highest"
            >
              <BookOpenIcon size={11} />
              Sửa
            </button>
          ) : (
            <span className="text-[10px] text-muted-foreground">
              {deck.foldersCount} thư mục
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
