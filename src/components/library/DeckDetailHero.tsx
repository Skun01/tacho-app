import {
  BookmarkIcon,
  BookmarkSimpleIcon,
  CopyIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { DECK_COPY } from '@/constants/deck'
import type { DeckDetailResponse } from '@/types/deck'

interface DeckDetailHeroProps {
  deck: DeckDetailResponse
  isBookmarkPending?: boolean
  isForkPending?: boolean
  onBookmarkToggle: () => void
  onFork: () => void
  onManage: () => void
}

export function DeckDetailHero({
  deck,
  isBookmarkPending = false,
  isForkPending = false,
  onBookmarkToggle,
  onFork,
  onManage,
}: DeckDetailHeroProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)] dark:bg-surface-container-high dark:shadow-[0_10px_26px_0_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap gap-2">
        {deck.type.name && (
          <Badge variant="outline" className="dark:border-border/80 dark:bg-surface-container-highest dark:text-foreground">
            {deck.type.name}
          </Badge>
        )}
        <Badge
          variant="outline"
          className={
            deck.visibility === 'Private'
              ? 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/18 dark:text-amber-200'
              : 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/18 dark:text-emerald-200'
          }
        >
          {DECK_COPY.visibilityLabels[deck.visibility]}
        </Badge>
        {deck.isOfficial && (
          <Badge className="dark:bg-primary/85 dark:text-primary-foreground">{'Chính thức'}</Badge>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">{deck.title}</h1>
        {deck.description && (
          <p className="text-sm text-muted-foreground">{deck.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">Người tạo: </span>
          {deck.createdBy.username}
        </span>
        <span>
          <span className="font-semibold text-foreground">{DECK_COPY.cardsLabel}: </span>
          {deck.cardsCount}
        </span>
        <span>
          <span className="font-semibold text-foreground">{DECK_COPY.folderLabel}: </span>
          {deck.foldersCount}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isBookmarkPending}
          onClick={onBookmarkToggle}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            deck.isBookmarked
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/18 dark:text-amber-200 dark:hover:bg-amber-500/26'
              : 'bg-surface-container-high text-muted-foreground hover:bg-surface-container-highest dark:bg-surface-container-highest/80 dark:hover:bg-surface-container-highest'
          }`}
        >
          {deck.isBookmarked ? (
            <BookmarkSimpleIcon size={14} weight="fill" />
          ) : (
            <BookmarkIcon size={14} />
          )}
          {deck.isBookmarked ? DECK_COPY.bookmarked : DECK_COPY.bookmark}
        </button>

        {!deck.isOwner && deck.visibility === 'Public' && deck.status === 'Published' && (
          <button
            type="button"
            disabled={isForkPending}
            onClick={onFork}
            className="flex items-center gap-1.5 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest dark:bg-surface-container-highest/80 dark:hover:bg-surface-container-highest"
          >
            <CopyIcon size={14} />
            {DECK_COPY.fork}
          </button>
        )}

        {deck.isOwner && (
          <button
            type="button"
            onClick={onManage}
            className="flex items-center gap-1.5 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest dark:bg-surface-container-highest/80 dark:hover:bg-surface-container-highest"
          >
            <PencilSimpleIcon size={14} />
            {DECK_COPY.manage}
          </button>
        )}
      </div>
    </div>
  )
}
