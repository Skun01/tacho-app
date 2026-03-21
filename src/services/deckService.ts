import type {
  DeckListItem,
  DeckDetailWithState,
  ListDecksParams,
  CreateDeckPayload,
  UpdateDeckPayload,
  ReorderCardsPayload,
} from '@/types/deck'
import type { FlashCard } from '@/types/card'
import {
  MOCK_STUDYING_DECKS,
  MOCK_MY_OWN_DECKS,
  MOCK_SAVED_DECKS,
  MOCK_APP_VOCAB_DECKS,
  MOCK_APP_GRAMMAR_DECKS,
  MOCK_TEXTBOOK_DECKS,
  MOCK_COMMUNITY_DECKS,
  MOCK_DECK_DETAILS,
} from '@/mocks/decks'

// ── All list-view decks in one flat array ─────────────────────────────────────
const ALL_DECKS: DeckListItem[] = [
  ...MOCK_STUDYING_DECKS,
  ...MOCK_MY_OWN_DECKS,
  ...MOCK_SAVED_DECKS,
  ...MOCK_APP_VOCAB_DECKS,
  ...MOCK_APP_GRAMMAR_DECKS,
  ...MOCK_TEXTBOOK_DECKS,
  ...MOCK_COMMUNITY_DECKS,
]

// De-duplicate by ID (a deck can appear in multiple mock arrays)
const DEDUPED_DECKS = ALL_DECKS.reduce<Map<string, DeckListItem>>((acc, d) => {
  if (!acc.has(d.id)) acc.set(d.id, d)
  return acc
}, new Map())

// ── Read ──────────────────────────────────────────────────────────────────────

/**
 * List decks with optional filtering.
 * Replace body with an axios call when the backend is ready.
 */
export async function listDecks(params: ListDecksParams = {}): Promise<DeckListItem[]> {
  let result = [...DEDUPED_DECKS.values()]

  if (params.source !== undefined)
    result = result.filter((d) => d.source === params.source)
  if (params.category !== undefined)
    result = result.filter((d) => d.category === params.category)
  if (params.isOwner !== undefined)
    result = result.filter((d) => d.isOwner === params.isOwner)
  if (params.isInReview !== undefined)
    result = result.filter((d) => d.isInReview === params.isInReview)
  if (params.isSaved !== undefined)
    result = result.filter((d) => d.isSaved === params.isSaved)
  if (params.textbook !== undefined)
    result = result.filter((d) => d.textbook === params.textbook)
  if (params.search) {
    const q = params.search.toLowerCase()
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.ownerName.toLowerCase().includes(q),
    )
  }

  return result
}

/**
 * Fetch a single deck with its cards and user state.
 * Replace body with: return apiClient.get(`/decks/${id}`)
 */
export async function getDeckDetail(id: string): Promise<DeckDetailWithState> {
  return MOCK_DECK_DETAILS[id] ?? MOCK_DECK_DETAILS['mv1']
}

// ── Write (mock — replace with axios calls when backend is ready) ─────────────

export async function createDeck(
  payload: CreateDeckPayload,
): Promise<DeckDetailWithState> {
  const now = new Date().toISOString()
  return {
    id: `user-${Date.now()}`,
    name: payload.name,
    description: payload.description,
    category: payload.category,
    source: 'user',
    coverIndex: 0,
    coverUrl: payload.coverUrl,
    ownerId: 'user-1',
    ownerName: 'Tôi',
    isPublic: payload.isPublic,
    totalCards: 0,
    vocabCount: 0,
    grammarCount: 0,
    userCount: 1,
    createdAt: now,
    updatedAt: now,
    cards: [],
    isOwner: true,
    isBookmarked: false,
    isSaved: false,
    isInReview: false,
    learnedCards: 0,
    reviewDue: 0,
  }
}

export async function updateDeck(
  id: string,
  payload: UpdateDeckPayload,
): Promise<void> {
  // mock no-op — replace with: return apiClient.patch(`/decks/${id}`, payload)
  void id
  void payload
}

export async function deleteDeck(id: string): Promise<void> {
  // mock no-op — replace with: return apiClient.delete(`/decks/${id}`)
  void id
}

export async function addCardsToDeck(
  deckId: string,
  cardIds: string[],
): Promise<void> {
  // mock no-op — replace with: return apiClient.post(`/decks/${deckId}/cards`, { cardIds })
  void deckId
  void cardIds
}

export async function removeCardFromDeck(
  deckId: string,
  cardId: string,
): Promise<void> {
  // mock no-op — replace with: return apiClient.delete(`/decks/${deckId}/cards/${cardId}`)
  void deckId
  void cardId
}

export async function reorderCards(
  deckId: string,
  payload: ReorderCardsPayload,
): Promise<void> {
  // mock no-op — replace with: return apiClient.put(`/decks/${deckId}/cards/order`, payload)
  void deckId
  void payload
}

export async function toggleBookmark(
  deckId: string,
  bookmarked: boolean,
): Promise<void> {
  // mock no-op — replace with: return apiClient.put(`/decks/${deckId}/bookmark`, { bookmarked })
  void deckId
  void bookmarked
}

export async function toggleInReview(
  deckId: string,
  inReview: boolean,
): Promise<void> {
  // mock no-op — replace with: return apiClient.put(`/decks/${deckId}/review`, { inReview })
  void deckId
  void inReview
}

export async function cloneDeck(
  deckId: string,
): Promise<DeckDetailWithState> {
  const source = MOCK_DECK_DETAILS[deckId] ?? MOCK_DECK_DETAILS['mv1']
  const now = new Date().toISOString()
  return {
    ...source,
    id: `clone-${Date.now()}`,
    ownerName: 'Tôi',
    ownerId: 'user-1',
    source: 'user',
    isPublic: false,
    isOwner: true,
    isSaved: false,
    isInReview: false,
    learnedCards: 0,
    reviewDue: 0,
    createdAt: now,
    updatedAt: now,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function updateDeckCardsLocally(
  deck: DeckDetailWithState,
  cards: FlashCard[],
): DeckDetailWithState {
  return {
    ...deck,
    cards,
    totalCards: cards.length,
    vocabCount: cards.filter((c) => c.type === 'vocab').length,
    grammarCount: cards.filter((c) => c.type === 'grammar').length,
  }
}
