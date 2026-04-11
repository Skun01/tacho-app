import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import NProgress from 'nprogress'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Navbar } from '@/components/layout/Navbar'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchHeader } from '@/components/search/SearchHeader'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { SearchEmptyState } from '@/components/search/SearchEmptyState'
import { useCardSearch } from '@/hooks/useCardSearch'
import { SEARCH_COPY } from '@/constants/search'
import type { SearchCardType } from '@/types/search'
import type { JlptLevel } from '@/types/vocabulary'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [selectedCardType, setSelectedCardType] = useState<SearchCardType | undefined>()
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel | undefined>()

  const searchQueryParams = useMemo(
    () => ({
      q: submittedQuery,
      cardType: selectedCardType,
      level: selectedLevel,
      page: 1,
      pageSize: 20,
    }),
    [submittedQuery, selectedCardType, selectedLevel],
  )

  const { data, isFetching, isError } = useCardSearch(
    searchQueryParams,
    Boolean(submittedQuery.trim()),
  )

  const results = data?.data ?? []
  const totalResults = data?.metaData?.total ?? results.length

  useEffect(() => {
    if (isError) {
      gooeyToast.error(SEARCH_COPY.searchError)
    }
  }, [isError])

  useEffect(() => {
    if (isFetching) {
      NProgress.start()
      return
    }

    NProgress.done()
  }, [isFetching])

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSubmittedQuery('')
      return
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: true })
    setSubmittedQuery(trimmed)
  }

  return (
    <>
      <PageHelmet
        title={SEARCH_COPY.pageTitle}
        description={SEARCH_COPY.pageDescription}
      />
      <Navbar />

      <main
        className="min-h-screen pt-20 pb-16"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 py-8">
            <SearchHeader
              query={query}
              totalResults={totalResults}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
            />

            <SearchFilters
              selectedCardType={selectedCardType}
              selectedLevel={selectedLevel}
              onCardTypeChange={setSelectedCardType}
              onLevelChange={setSelectedLevel}
            />

            {isFetching ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col gap-3">
                {results.map((card) => (
                  <SearchResultCard key={card.id} card={card} />
                ))}
              </div>
            ) : submittedQuery.trim() ? (
              <SearchEmptyState />
            ) : null}
          </div>
        </div>
      </main>
    </>
  )
}
