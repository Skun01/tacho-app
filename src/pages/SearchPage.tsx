import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { SearchFiltersBar } from '@/components/search/SearchFiltersBar'
import { AddToDeckModal } from '@/components/search/AddToDeckModal'
import { BulkActionBar } from '@/components/search/BulkActionBar'
import { SEARCH_COPY } from '@/constants/search'
import { useSearchPage } from '@/hooks/useSearchPage'

export function SearchPage() {
  const {
    query, input, setInput,
    filteredVocab, filteredGrammar, showVocabSection, showGrammarSection,
    selected, selectedCount, typeFilter, setTypeFilter,
    jlptFilter, selectMode, deckModalTarget, showDeckModal,
    toggleJlpt, handleToggleSelectMode, handleDeckConfirm,
    makeCardProps, setDeckModalTarget, navigate,
  } = useSearchPage()

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
          <SearchFiltersBar
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            jlptFilter={jlptFilter}
            onJlptToggle={toggleJlpt}
            selectMode={selectMode}
            onToggleSelectMode={handleToggleSelectMode}
          />

          <div className={`flex flex-col gap-8 ${selectMode && selectedCount > 0 ? 'pb-24' : ''}`}>
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

      {selectMode && selectedCount > 0 && (
        <BulkActionBar
          count={selectedCount}
          onAddToDeck={() => setDeckModalTarget(null)}
          onStartStudy={() => {
            const batchIds = Array.from(selected)
            navigate('/study', { state: { batchIds, mode: 'learn' } })
          }}
          onDeselect={() => navigate(0)}
        />
      )}

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
