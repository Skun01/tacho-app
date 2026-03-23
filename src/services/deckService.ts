import type {
  DeckListItem,
  DeckDetailWithState,
  ListDecksParams,
  CreateDeckPayload,
  UpdateDeckPayload,
  ReorderCardsPayload,
} from '@/types/deck'
import type { FlashCard } from '@/types/card'
import { mockDataStore } from './mockDataStore'

// ── All list-view decks in one flat array ─────────────────────────────────────
const ALL_DECKS: DeckListItem[] = []
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
  void DEDUPED_DECKS
  return mockDataStore.listDecks(params)
}

/**
 * Fetch a single deck with its cards and user state.
 * Replace body with: return apiClient.get(`/decks/${id}`)
 */
export async function getDeckDetail(id: string): Promise<DeckDetailWithState> {
  return mockDataStore.getDeckDetail(id)
}

// ── Write (mock — replace with axios calls when backend is ready) ─────────────

export async function createDeck(
  payload: CreateDeckPayload,
): Promise<DeckDetailWithState> {
  return mockDataStore.createDeck(payload)
}

export async function updateDeck(
  id: string,
  payload: UpdateDeckPayload,
): Promise<void> {
  await mockDataStore.updateDeck(id, payload)
}

export async function deleteDeck(id: string): Promise<void> {
  await mockDataStore.deleteDeck(id)
}

export async function addCardsToDeck(
  deckId: string,
  cardIds: string[],
): Promise<void> {
  await mockDataStore.addCardsToDeck(deckId, cardIds)
}

export async function removeCardFromDeck(
  deckId: string,
  cardId: string,
): Promise<void> {
  await mockDataStore.removeCardFromDeck(deckId, cardId)
}

export async function reorderCards(
  deckId: string,
  payload: ReorderCardsPayload,
): Promise<void> {
  await mockDataStore.reorderCards(deckId, payload)
}

export async function toggleBookmark(
  deckId: string,
  bookmarked: boolean,
): Promise<void> {
  await mockDataStore.toggleDeckBookmark(deckId, bookmarked)
}

export async function toggleInReview(
  deckId: string,
  inReview: boolean,
): Promise<void> {
  await mockDataStore.toggleDeckInReview(deckId, inReview)
}

export async function toggleSaved(
  deckId: string,
  saved: boolean,
): Promise<void> {
  await mockDataStore.toggleDeckSaved(deckId, saved)
}

export async function cloneDeck(
  deckId: string,
): Promise<DeckDetailWithState> {
  return mockDataStore.cloneDeck(deckId)
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
