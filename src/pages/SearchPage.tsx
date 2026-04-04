import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { Navbar } from '@/components/layout/Navbar'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchHeader } from '@/components/search/SearchHeader'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { SearchEmptyState } from '@/components/search/SearchEmptyState'
import { vocabularyService } from '@/services/vocabularyService'
import { SEARCH_COPY } from '@/constants/search'
import type { VocabularyCardSummary, JlptLevel, PartOfSpeech } from '@/types/vocabulary'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<VocabularyCardSummary[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel | undefined>()
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | undefined>()

  const performSearch = useCallback(
    async (q: string, level?: JlptLevel, pos?: PartOfSpeech) => {
      if (!q.trim()) {
        setResults([])
        setTotalResults(0)
        return
      }

      setIsLoading(true)
      try {
        const res = await vocabularyService.search({
          q,
          level,
          partOfSpeech: pos,
        })
        if (res.success) {
          setResults(res.data)
          setTotalResults(res.metaData?.total ?? res.data.length)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Search on mount + when filters change
  useEffect(() => {
    performSearch(query, selectedLevel, selectedPos)
  }, [selectedLevel, selectedPos]) // eslint-disable-line react-hooks/exhaustive-deps

  // Also search when URL query changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') ?? ''
    if (urlQuery !== query) {
      setQuery(urlQuery)
      performSearch(urlQuery, selectedLevel, selectedPos)
    }
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: true })
      performSearch(trimmed, selectedLevel, selectedPos)
    }
  }

  return (
    <>
      <PageHelmet
        title={SEARCH_COPY.pageTitle}
        description="Tìm kiếm từ vựng tiếng Nhật trên Tacho."
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
              selectedLevel={selectedLevel}
              selectedPos={selectedPos}
              onLevelChange={setSelectedLevel}
              onPosChange={setSelectedPos}
            />

            {/* Results — shadcn Skeleton for loading */}
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col gap-3">
                {results.map((card) => (
                  <SearchResultCard key={card.id} card={card} />
                ))}
              </div>
            ) : query.trim() ? (
              <SearchEmptyState />
            ) : null}
          </div>
        </div>
      </main>
    </>
  )
}
