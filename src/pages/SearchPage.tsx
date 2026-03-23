import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { SearchFiltersBar } from '@/components/search/SearchFiltersBar'
import { AddToDeckModal } from '@/components/search/AddToDeckModal'
import { BulkActionBar } from '@/components/search/BulkActionBar'
import { SEARCH_COPY } from '@/constants/search'
import type { FlashCardWithProgress, CardProgress, JlptLevel } from '@/types/card'
import type { TypeFilter } from '@/components/search/SearchFiltersBar'
import { addCardsToDeck } from '@/services/deckService'
import { searchCards, updateCardProgress } from '@/services/cardService'

export function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [input, setInput] = useState(query)
  const [vocabCards, setVocabCards] = useState<FlashCardWithProgress[]>([])
  const [grammarCards, setGrammarCards] = useState<FlashCardWithProgress[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Filters
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [jlptFilter, setJlptFilter] = useState<Set<JlptLevel>>(new Set())

  // Select mode — checkboxes only visible when true
  const [selectMode, setSelectMode] = useState(false)

  // null = bulk, string = single card id
  const [deckModalTarget, setDeckModalTarget] = useState<string | null | undefined>(undefined)
  const showDeckModal = deckModalTarget !== undefined

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function loadResults(currentQuery: string) {
    const results = await searchCards(currentQuery)
    setVocabCards(results.filter((c) => c.type === 'vocab'))
    setGrammarCards(results.filter((c) => c.type === 'grammar'))
  }

  function replaceCard(nextCard: FlashCardWithProgress) {
    const apply = (list: FlashCardWithProgress[]) =>
      list.map((card) => (card.id === nextCard.id ? nextCard : card))
    setVocabCards(apply)
    setGrammarCards(apply)
  }

  // Sync input → URL (debounced 300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const trimmed = input.trim()
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true })
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [input, setSearchParams])

  // Fetch results when URL query changes
  useEffect(() => {
    if (!query) {
      setVocabCards([])
      setGrammarCards([])
      return
    }
    void loadResults(query)
    setSelected(new Set())
  }, [query])

  async function patchCard(id: string, patch: Partial<CardProgress>) {
    const nextCard = await updateCardProgress(id, patch)
    replaceCard(nextCard)
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleDeckConfirm(deckId: string, _deckName: string) {
    const ids = deckModalTarget === null
      ? Array.from(selected)
      : deckModalTarget
        ? [deckModalTarget]
        : []
    if (ids.length > 0) {
      await addCardsToDeck(deckId, ids)
    }
    setDeckModalTarget(undefined)
    setSelected(new Set())
  }

  function toggleJlpt(level: JlptLevel) {
    setJlptFilter((prev) => {
      const next = new Set(prev)
      next.has(level) ? next.delete(level) : next.add(level)
      return next
    })
  }

  function handleToggleSelectMode() {
    setSelectMode((v) => {
      if (v) setSelected(new Set()) // clear on exit
      return !v
    })
  }

  // Apply client-side filters to fetched results
  function applyFilters(cards: FlashCardWithProgress[]) {
    return cards.filter(
      (c) => jlptFilter.size === 0 || jlptFilter.has(c.jlptLevel),
    )
  }

  const showVocabSection = typeFilter !== 'grammar'
  const showGrammarSection = typeFilter !== 'vocab'
  const filteredVocab = showVocabSection ? applyFilters(vocabCards) : []
  const filteredGrammar = showGrammarSection ? applyFilters(grammarCards) : []

  const selectedCount = selected.size

  function makeCardProps(card: FlashCardWithProgress) {
    return {
      card,
      selectable: selectMode,
      isSelected: selected.has(card.id),
      onSelect: () => toggleSelect(card.id),
      onMarkPro: () => void patchCard(card.id, { masteryLevel: 5, isInReview: true }),
      onToggleSave: () =>
        void patchCard(card.id, { isSaved: !(card.progress?.isSaved ?? false) }),
      onAddToDeck: () => setDeckModalTarget(card.id),
      onResetProgress: () => void patchCard(card.id, { masteryLevel: 0, isInReview: false }),
      onAddToReview: () => void patchCard(card.id, { isInReview: true }),
    }
  }

  return (
    <DashboardLayout>
      {/* Search bar */}
      <div className="mb-6 flex items-center gap-3 rounded-full bg-background px-5 py-3 shadow-[0_2px_12px_0_rgba(29,28,19,0.08)]">
        <MagnifyingGlassIcon size={16} className="shrink-0 text-muted-foreground" />
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={SEARCH_COPY.placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      {!query ? (
        <p className="py-24 text-center text-sm text-muted-foreground">
          {SEARCH_COPY.emptyQuery}
        </p>
      ) : (
        <>
          {/* Filters + select mode toggle */}
          <SearchFiltersBar
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            jlptFilter={jlptFilter}
            onJlptToggle={toggleJlpt}
            selectMode={selectMode}
            onToggleSelectMode={handleToggleSelectMode}
          />

          <div className={`flex flex-col gap-8 ${selectMode && selectedCount > 0 ? 'pb-24' : ''}`}>
            {/* Vocabulary section */}
            {showVocabSection && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {SEARCH_COPY.vocabSection}
                </h2>
                {filteredVocab.length === 0 ? (
                  <div className="rounded-2xl bg-background px-6 py-8 text-center shadow-[0_1px_8px_0_rgba(29,28,19,0.06)]">
                    <p className="text-sm text-muted-foreground">{SEARCH_COPY.emptyVocab(query)}</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {filteredVocab.map((card) => (
                      <SearchResultCard key={card.id} {...makeCardProps(card)} />
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Grammar section */}
            {showGrammarSection && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {SEARCH_COPY.grammarSection}
                </h2>
                {filteredGrammar.length === 0 ? (
                  <div className="rounded-2xl bg-background px-6 py-8 text-center shadow-[0_1px_8px_0_rgba(29,28,19,0.06)]">
                    <p className="text-sm text-muted-foreground">
                      {SEARCH_COPY.emptyGrammar(query)}
                    </p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {filteredGrammar.map((card) => (
                      <SearchResultCard key={card.id} {...makeCardProps(card)} />
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        </>
      )}

      {/* Bulk action bar — only when select mode is active */}
      {selectMode && selectedCount > 0 && (
        <BulkActionBar
          count={selectedCount}
          onAddToDeck={() => setDeckModalTarget(null)}
          onStartStudy={() => {
            const batchIds = Array.from(selected)
            setSelected(new Set())
            navigate('/study', { state: { batchIds, mode: 'learn' } })
          }}
          onDeselect={() => setSelected(new Set())}
        />
      )}

      {/* Add to deck modal */}
      {showDeckModal && (
        <AddToDeckModal
          cardCount={deckModalTarget === null ? selectedCount : 1}
          onClose={() => setDeckModalTarget(undefined)}
          onConfirm={handleDeckConfirm}
        />
      )}
    </DashboardLayout>
  )
}
