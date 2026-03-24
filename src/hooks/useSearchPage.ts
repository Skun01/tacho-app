import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { searchCards, updateCardProgress } from '@/services/cardService'
import { addCardsToDeck } from '@/services/deckService'
import type { FlashCardWithProgress, CardProgress, JlptLevel } from '@/types/card'
import type { TypeFilter } from '@/components/search/SearchFiltersBar'
import { CARD_TYPE } from '@/types/card'


interface SearchResultCardProps {
  card: FlashCardWithProgress
  selectable: boolean
  isSelected: boolean
  onSelect: () => void
  onMarkPro: () => void
  onToggleSave: () => void
  onAddToDeck: () => void
  onResetProgress: () => void
  onAddToReview: () => void
}

interface UseSearchPageResult {

  query: string
  input: string
  setInput: (v: string) => void
  filteredVocab: FlashCardWithProgress[]
  filteredGrammar: FlashCardWithProgress[]
  showVocabSection: boolean
  showGrammarSection: boolean
  selected: Set<string>
  selectedCount: number
  typeFilter: TypeFilter
  setTypeFilter: (f: TypeFilter) => void
  jlptFilter: Set<JlptLevel>
  selectMode: boolean
  deckModalTarget: string | null | undefined
  showDeckModal: boolean
  toggleJlpt: (level: JlptLevel) => void
  handleToggleSelectMode: () => void
  handleDeckConfirm: (deckId: string, deckName: string) => Promise<void>
  makeCardProps: (card: FlashCardWithProgress) => SearchResultCardProps
  setDeckModalTarget: (v: string | null | undefined) => void
  navigate: ReturnType<typeof useNavigate>
}

export function useSearchPage(): UseSearchPageResult {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [input, setInput] = useState(query)
  const [vocabCards, setVocabCards] = useState<FlashCardWithProgress[]>([])
  const [grammarCards, setGrammarCards] = useState<FlashCardWithProgress[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [jlptFilter, setJlptFilter] = useState<Set<JlptLevel>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [deckModalTarget, setDeckModalTarget] = useState<string | null | undefined>(undefined)
  const showDeckModal = deckModalTarget !== undefined

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (!query) return
    void searchCards(query).then((results) => {
      setVocabCards(results.filter((c) => c.type === CARD_TYPE.VOCAB))
      setGrammarCards(results.filter((c) => c.type === CARD_TYPE.GRAMMAR))
      setSelected(new Set())
    })
  }, [query])

  // Reset card lists when query is cleared (derived, not from effect)
  const effectiveVocabCards = query ? vocabCards : []
  const effectiveGrammarCards = query ? grammarCards : []

  async function patchCard(id: string, patch: Partial<CardProgress>) {
    const nextCard = await updateCardProgress(id, patch)
    replaceCard(nextCard)
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  async function handleDeckConfirm(deckId: string) {
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
      if (next.has(level)) { next.delete(level) } else { next.add(level) }
      return next
    })
  }

  function handleToggleSelectMode() {
    setSelectMode((v) => {
      if (v) setSelected(new Set())
      return !v
    })
  }

  function applyFilters(cards: FlashCardWithProgress[]) {
    return cards.filter(
      (c) => jlptFilter.size === 0 || jlptFilter.has(c.jlptLevel),
    )
  }

  const showVocabSection = typeFilter !== 'grammar'
  const showGrammarSection = typeFilter !== 'vocab'
  const filteredVocab = showVocabSection ? applyFilters(effectiveVocabCards) : []
  const filteredGrammar = showGrammarSection ? applyFilters(effectiveGrammarCards) : []
  const selectedCount = selected.size

  function makeCardProps(card: FlashCardWithProgress): SearchResultCardProps {
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

  return {
    query, input, setInput,
    filteredVocab, filteredGrammar, showVocabSection, showGrammarSection,
    selected, selectedCount, typeFilter, setTypeFilter,
    jlptFilter, selectMode, deckModalTarget, showDeckModal,
    toggleJlpt, handleToggleSelectMode, handleDeckConfirm,
    makeCardProps, setDeckModalTarget, navigate,
  }
}
