import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useSearchParams } from 'react-router'
import { DeckCard } from '@/components/library/DeckCard'
import { DeckEmptyState } from '@/components/library/DeckEmptyState'
import { DeckFormPanel } from '@/components/library/DeckFormPanel'
import { DeckListSkeleton } from '@/components/library/DeckListSkeleton'
import { DeckPagination } from '@/components/library/DeckPagination'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DECK_COPY } from '@/constants/deck'
import { LIBRARY_COPY, type LibraryTabKey } from '@/constants/library'
import {
  useBookmarkedDecks,
  useCreateDeck,
  useDeckTypes,
  useMyDecks,
  usePublicDecks,
  useToggleDeckBookmark,
} from '@/hooks/useDecks'
import { deckService } from '@/services/deckService'
import { Input } from '@/components/ui/input'
import type { DeckListItemResponse, DeckVisibility } from '@/types/deck'

const PAGE_SIZE = 12

function getTabFromSearchParams(searchParams: URLSearchParams): LibraryTabKey {
  const tab = searchParams.get('tab')
  if (tab === 'myDecks' || tab === 'systemDecks') {
    return tab
  }
  return 'explore'
}

export function LibraryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = getTabFromSearchParams(searchParams)
  const page = Number(searchParams.get('page') ?? '1') || 1
  const search = searchParams.get('q') ?? ''
  const typeId = searchParams.get('typeId') ?? ''
  const myDecksSubTab = (searchParams.get('subtab') ?? 'all') as 'all' | 'private' | 'public' | 'saved'
  const visibility = (searchParams.get('visibility') ?? '') as '' | DeckVisibility
  const [showCreateForm, setShowCreateForm] = useState(false)

  const publicParams = useMemo(
    () => ({
      q: search || undefined,
      typeId: typeId || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [page, search, typeId],
  )

  const systemParams = useMemo(
    () => ({
      q: search || undefined,
      typeId: typeId || undefined,
      officialOnly: true,
      page,
      pageSize: PAGE_SIZE,
    }),
    [page, search, typeId],
  )

  const personalParams = useMemo(
    () => ({
      q: search || undefined,
      typeId: typeId || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [page, search, typeId],
  )

  const deckTypesQuery = useDeckTypes()
  const publicDecksQuery = usePublicDecks(publicParams)
  const systemDecksQuery = usePublicDecks(systemParams)
  const bookmarkedDecksQuery = useBookmarkedDecks(personalParams, activeTab === 'myDecks' && myDecksSubTab === 'saved')
  const myDecksQuery = useMyDecks(personalParams, activeTab === 'myDecks' && myDecksSubTab !== 'saved')
  const toggleBookmarkMutation = useToggleDeckBookmark()
  const createDeckMutation = useCreateDeck()

  const activeQuery =
    activeTab === 'myDecks'
      ? myDecksSubTab === 'saved'
        ? bookmarkedDecksQuery
        : myDecksQuery
      : activeTab === 'systemDecks'
        ? systemDecksQuery
        : publicDecksQuery

  useEffect(() => {
    if (activeQuery.isFetching || deckTypesQuery.isFetching) {
      NProgress.start()
      return
    }

    NProgress.done()
  }, [activeQuery.isFetching, deckTypesQuery.isFetching])

  const activeResult = activeQuery.data
  const sourceItems = activeResult?.items ?? []
  const filteredItems =
    activeTab === 'myDecks' && myDecksSubTab !== 'saved' && visibility
      ? sourceItems.filter((item) => item.visibility === visibility)
      : sourceItems
  const displayItems =
    activeTab === 'explore'
      ? [...filteredItems].sort((left, right) => Number(left.isOfficial) - Number(right.isOfficial))
      : filteredItems

  const myDecksMode = myDecksSubTab === 'saved'
    ? 'saved'
    : visibility === 'Private'
      ? 'private'
      : visibility === 'Public'
        ? 'public'
        : 'all'

  const totalPages = Math.max(
    1,
    Math.ceil((activeResult?.meta?.total ?? displayItems.length) / PAGE_SIZE),
  )

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        next.delete(key)
        return
      }
      next.set(key, value)
    })
    setSearchParams(next, { replace: true })
  }

  function handleTabChange(tab: LibraryTabKey) {
    setSearchParams(
      new URLSearchParams({
        tab,
        page: '1',
        ...(tab === 'myDecks' ? { subtab: 'all' } : {}),
      }),
      { replace: true },
    )
    setShowCreateForm(false)
  }

  function handleOpen(deckId: string) {
    navigate(`/library/decks/${deckId}`)
  }

  function handleManage(deckId: string) {
    navigate(`/library/my-decks/${deckId}/edit`)
  }

  function handleToggleBookmark(deck: DeckListItemResponse) {
    toggleBookmarkMutation.mutate({
      deckId: deck.id,
      bookmarked: !deck.isBookmarked,
    })
  }

  function renderDeckSection() {
    if (activeQuery.isLoading || deckTypesQuery.isLoading) {
      return <DeckListSkeleton />
    }

    if (activeQuery.isError) {
      return (
        <DeckEmptyState
          title={LIBRARY_COPY.states.loadFailed}
          actionLabel={LIBRARY_COPY.actions.retry}
          onAction={() => activeQuery.refetch()}
        />
      )
    }

    if (displayItems.length === 0) {
      const emptyTitle =
        activeTab === 'myDecks' && myDecksSubTab === 'saved'
          ? LIBRARY_COPY.states.emptyBookmarks
          : activeTab === 'systemDecks'
            ? LIBRARY_COPY.states.emptySystemDecks
          : activeTab === 'myDecks'
            ? LIBRARY_COPY.states.emptyMyDecks
            : LIBRARY_COPY.states.emptyExplore

      return (
        <DeckEmptyState
          title={emptyTitle}
          actionLabel={activeTab === 'myDecks' && myDecksSubTab !== 'saved' ? LIBRARY_COPY.createDeck : undefined}
          onAction={activeTab === 'myDecks' && myDecksSubTab !== 'saved' ? () => setShowCreateForm(true) : undefined}
        />
      )
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {displayItems.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onOpen={handleOpen}
            onManage={handleManage}
            onToggleBookmark={handleToggleBookmark}
            emphasizeOfficial={activeTab === 'systemDecks'}
            isBookmarkPending={
              toggleBookmarkMutation.isPending &&
              toggleBookmarkMutation.variables?.deckId === deck.id
            }
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <PageHelmet title={LIBRARY_COPY.pageTitle} description={LIBRARY_COPY.pageDescription} />
      <AppLayout
        mainClassName="min-h-screen pt-24 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:px-8">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-foreground">{LIBRARY_COPY.heading}</h1>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  className="shrink-0 rounded-full"
                  onClick={() => {
                    if (activeTab !== 'myDecks') {
                      handleTabChange('myDecks')
                    }
                    setShowCreateForm(true)
                  }}
                >
                  <PlusIcon size={14} weight="bold" />
                  {LIBRARY_COPY.createDeck}
                </Button>

                <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background px-5 py-3 shadow-[0_1px_8px_0_rgba(29,28,19,0.08)] sm:w-80">
                  <MagnifyingGlassIcon size={15} className="shrink-0 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => updateParams({ q: event.target.value || null, page: '1' })}
                    placeholder={LIBRARY_COPY.searchPlaceholder}
                    className="h-6 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto rounded-xl bg-surface-container p-1">
              {(Object.entries(LIBRARY_COPY.tabs) as Array<[LibraryTabKey, string]>).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`shrink-0 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeTab === key
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {(activeTab === 'explore' || activeTab === 'systemDecks') && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'systemDecks'
                    ? LIBRARY_COPY.systemTabHint
                    : LIBRARY_COPY.exploreTabHint}
                </p>
                {activeTab === 'explore' && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateParams({ typeId: null, page: '1' })}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                        !typeId
                          ? 'bg-primary text-background'
                          : 'bg-surface-container text-muted-foreground hover:bg-surface-container-highest hover:text-foreground'
                      }`}
                    >
                      {LIBRARY_COPY.allTypes}
                    </button>
                    {(deckTypesQuery.data ?? []).map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateParams({ typeId: type.id, page: '1' })}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                          typeId === type.id
                            ? 'bg-primary text-background'
                            : 'bg-surface-container text-muted-foreground hover:bg-surface-container-highest hover:text-foreground'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'myDecks' && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-1 rounded-xl bg-surface-container p-1 w-fit">
                  {(Object.entries(LIBRARY_COPY.mySubTabs) as Array<[typeof myDecksMode, string]>).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        updateParams({
                          subtab: key,
                          visibility:
                            key === 'private'
                              ? 'Private'
                              : key === 'public'
                                ? 'Public'
                                : null,
                          page: '1',
                        })
                      }
                      className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                        myDecksMode === key
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

              </div>
            )}

            <div>{renderDeckSection()}</div>

            <DeckPagination
              page={page}
              totalPages={totalPages}
              onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
            />
          </section>
        </div>

        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="w-full max-w-md overflow-hidden p-0" showCloseButton>
            <DeckFormPanel
              title={DECK_COPY.createDeckTitle}
              deckTypes={deckTypesQuery.data ?? []}
              submitLabel={DECK_COPY.createSubmit}
              isPending={createDeckMutation.isPending}
              variant="modal"
              onCancel={() => setShowCreateForm(false)}
              onSubmit={async (values) => {
                const uploadedImage = values.coverImageFile
                  ? await deckService.uploadDeckImage(values.coverImageFile)
                  : null

                await createDeckMutation.mutateAsync({
                  title: values.title,
                  description: values.description || undefined,
                  coverImageUrl: uploadedImage?.fileUrl ?? null,
                  visibility: values.visibility,
                  typeId: values.typeId || null,
                })
                setShowCreateForm(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </AppLayout>
    </>
  )
}
