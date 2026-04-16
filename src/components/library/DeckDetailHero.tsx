import { ArrowSquareOutIcon, BookmarkSimpleIcon, CopySimpleIcon, LockSimpleIcon, PencilSimpleIcon, StackSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DECK_COPY } from '@/constants/deck'
import { resolveMediaUrl } from '@/lib/mediaUrl'
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
  const coverUrl = resolveMediaUrl(deck.coverImageUrl)

  return (
    <Card className="overflow-hidden rounded-[32px] border-border/70 bg-card/95 py-0">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative min-h-64 bg-gradient-to-br from-[#dbeafe] via-[#fff9eb] to-[#dcfce7]">
          {coverUrl && (
            <img
              src={coverUrl}
              alt={deck.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-2 p-6">
            {deck.type.name && <Badge variant="secondary">{deck.type.name}</Badge>}
            <Badge variant="secondary">{DECK_COPY.visibilityLabels[deck.visibility]}</Badge>
            <Badge variant="secondary">{DECK_COPY.statusLabels[deck.status]}</Badge>
            {deck.isOfficial && <Badge>{'Chính thức'}</Badge>}
          </div>
        </div>

        <div className="p-0">
          <CardHeader className="space-y-4 px-6 pt-6">
            <div className="space-y-3">
              <CardTitle className="text-2xl">{deck.title}</CardTitle>
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                {deck.description || DECK_COPY.detailDescription}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {DECK_COPY.folderLabel}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">{deck.foldersCount}</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {DECK_COPY.cardsLabel}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">{deck.cardsCount}</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Người tạo
                </p>
                <p className="mt-1 truncate text-lg font-semibold text-foreground">
                  {deck.createdBy.username}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={deck.isBookmarked ? 'secondary' : 'default'}
                disabled={isBookmarkPending}
                onClick={onBookmarkToggle}
              >
                <BookmarkSimpleIcon size={18} weight={deck.isBookmarked ? 'fill' : 'regular'} />
                {deck.isBookmarked ? DECK_COPY.bookmarked : DECK_COPY.bookmark}
              </Button>

              {!deck.isOwner && deck.visibility === 'Public' && deck.status === 'Published' && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isForkPending}
                  onClick={onFork}
                >
                  <CopySimpleIcon size={18} />
                  {DECK_COPY.fork}
                </Button>
              )}

              {deck.isOwner && (
                <Button type="button" variant="outline" onClick={onManage}>
                  <PencilSimpleIcon size={18} />
                  {DECK_COPY.manage}
                </Button>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-background px-4 py-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <StackSimpleIcon size={18} />
                {deck.forkedFromId ? (
                  <span className="flex items-center gap-2">
                    Bộ thẻ này được fork từ bộ khác.
                    <ArrowSquareOutIcon size={16} />
                  </span>
                ) : deck.visibility === 'Private' ? (
                  <span className="flex items-center gap-2">
                    <LockSimpleIcon size={16} />
                    Chỉ chủ sở hữu mới xem được bộ thẻ riêng tư.
                  </span>
                ) : (
                  <span>Bộ thẻ công khai có thể được bookmark hoặc fork.</span>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

