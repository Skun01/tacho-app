import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { DeckCardSearchBar } from '@/components/library/DeckCardSearchBar'
import { DeckDetailHero } from '@/components/library/DeckDetailHero'
import { DeckEmptyState } from '@/components/library/DeckEmptyState'
import { DeckFolderSection } from '@/components/library/DeckFolderSection'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import { DECK_COPY } from '@/constants/deck'
import { useDeckDetail, useForkDeck, useToggleDeckBookmark } from '@/hooks/useDecks'

export function DeckDetailPage() {
  const navigate = useNavigate()
  const { deckId = '' } = useParams()
  const deckQuery = useDeckDetail(deckId, Boolean(deckId))
  const bookmarkMutation = useToggleDeckBookmark()
  const forkMutation = useForkDeck()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (deckQuery.isFetching) {
      NProgress.start()
      return
    }

    NProgress.done()
  }, [deckQuery.isFetching])

  const deck = deckQuery.data
  const sortedFolders = useMemo(
    () => deck?.folders.slice().sort((left, right) => left.position - right.position) ?? [],
    [deck],
  )
  const totalCards = useMemo(
    () => sortedFolders.reduce((count, folder) => count + folder.cards.length, 0),
    [sortedFolders],
  )

  return (
    <>
      <PageHelmet
        title={deck?.title ?? DECK_COPY.detailTitle}
        description={deck?.description ?? DECK_COPY.detailDescription}
      />
      <AppLayout
        mainClassName="min-h-screen pt-24 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:px-8">
          <Button
            type="button"
            variant="ghost"
            className="w-fit rounded-full"
            onClick={() => navigate('/library')}
          >
            <ArrowLeftIcon size={18} />
            {DECK_COPY.backToLibrary}
          </Button>

          {deckQuery.isError || !deck ? (
            <DeckEmptyState
              title={DECK_COPY.loadFailed}
              actionLabel={DECK_COPY.backToLibrary}
              onAction={() => navigate('/library')}
            />
          ) : (
            <>
              <DeckDetailHero
                deck={deck}
                isBookmarkPending={bookmarkMutation.isPending}
                isForkPending={forkMutation.isPending}
                onBookmarkToggle={() =>
                  bookmarkMutation.mutate({
                    deckId: deck.id,
                    bookmarked: !deck.isBookmarked,
                  })
                }
                onFork={() => forkMutation.mutate(deck.id)}
                onManage={() => navigate(`/library/my-decks/${deck.id}/edit`)}
              />

              {totalCards > 0 && (
                <DeckCardSearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={DECK_COPY.searchDeckCardsPlaceholder}
                />
              )}

              <section className="space-y-4">
                {sortedFolders.length === 0 ? (
                  <DeckEmptyState title={DECK_COPY.emptyFolders} />
                ) : (
                  sortedFolders.map((folder) => (
                    <DeckFolderSection
                      key={folder.id}
                      folder={folder}
                      searchQuery={searchQuery}
                    />
                  ))
                )}
              </section>
            </>
          )}
        </div>
      </AppLayout>
    </>
  )
}
