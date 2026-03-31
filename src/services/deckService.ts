import type {
  DeckListItem,
  DeckDetailWithState,
  ListDecksParams,
  CreateDeckPayload,
  UpdateDeckPayload,
  ReorderCardsPayload,
} from '@/types/deck'
import type { FlashCard } from '@/types/card'
import type { ApiResponse } from '@/types/api'
import api from './api'

type ApiDeckUserState = {
  isOwner: boolean
  isBookmarked: boolean
  isSaved: boolean
  isInReview: boolean
  learnedCards: number
  reviewDue: number
}

type ApiDeckListItem = Omit<DeckListItem, 'isOwner' | 'isBookmarked' | 'isSaved' | 'isInReview' | 'learnedCards' | 'reviewDue'> & {
  userState?: ApiDeckUserState
}

type ApiDeckDetail = Omit<DeckDetailWithState, 'isOwner' | 'isBookmarked' | 'isSaved' | 'isInReview' | 'learnedCards' | 'reviewDue'> & {
  userState?: ApiDeckUserState
}

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
  const response = await api.get<ApiResponse<ApiDeckListItem[]>>('/decks', { params })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return (response.data.data ?? []).map((item) => ({
    ...item,
    isOwner: item.userState?.isOwner ?? false,
    isBookmarked: item.userState?.isBookmarked ?? false,
    isSaved: item.userState?.isSaved ?? false,
    isInReview: item.userState?.isInReview ?? false,
    learnedCards: item.userState?.learnedCards ?? 0,
    reviewDue: item.userState?.reviewDue ?? 0,
  }))
}

/**
 * Fetch a single deck with its cards and user state.
 * Replace body with: return apiClient.get(`/decks/${id}`)
 */
export async function getDeckDetail(id: string): Promise<DeckDetailWithState> {
  const response = await api.get<ApiResponse<ApiDeckDetail>>(`/decks/${id}`)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? 'Common_404')
  }

  const deck = response.data.data
  return {
    ...deck,
    isOwner: deck.userState?.isOwner ?? false,
    isBookmarked: deck.userState?.isBookmarked ?? false,
    isSaved: deck.userState?.isSaved ?? false,
    isInReview: deck.userState?.isInReview ?? false,
    learnedCards: deck.userState?.learnedCards ?? 0,
    reviewDue: deck.userState?.reviewDue ?? 0,
  }
}

// ── Write (mock — replace with axios calls when backend is ready) ─────────────

export async function createDeck(
  payload: CreateDeckPayload,
): Promise<DeckDetailWithState> {
  const response = await api.post<ApiResponse<ApiDeckDetail>>('/decks', payload)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  const deck = response.data.data
  return {
    ...deck,
    isOwner: deck.userState?.isOwner ?? false,
    isBookmarked: deck.userState?.isBookmarked ?? false,
    isSaved: deck.userState?.isSaved ?? false,
    isInReview: deck.userState?.isInReview ?? false,
    learnedCards: deck.userState?.learnedCards ?? 0,
    reviewDue: deck.userState?.reviewDue ?? 0,
  }
}

export async function updateDeck(
  id: string,
  payload: UpdateDeckPayload,
): Promise<void> {
  const response = await api.patch<ApiResponse<object>>(`/decks/${id}`, payload)
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function deleteDeck(id: string): Promise<void> {
  const response = await api.delete<ApiResponse<object>>(`/decks/${id}`)
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function addCardsToDeck(
  deckId: string,
  cardIds: string[],
): Promise<void> {
  const response = await api.post<ApiResponse<object>>(`/decks/${deckId}/cards`, { cardIds })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function removeCardFromDeck(
  deckId: string,
  cardId: string,
): Promise<void> {
  const response = await api.delete<ApiResponse<object>>(`/decks/${deckId}/cards/${cardId}`)
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function reorderCards(
  deckId: string,
  payload: ReorderCardsPayload,
): Promise<void> {
  const response = await api.patch<ApiResponse<object>>(`/decks/${deckId}/cards/reorder`, payload)
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function toggleBookmark(
  deckId: string,
  bookmarked: boolean,
): Promise<void> {
  const response = await api.patch<ApiResponse<object>>(`/decks/${deckId}/state`, { isBookmarked: bookmarked })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function toggleInReview(
  deckId: string,
  inReview: boolean,
): Promise<void> {
  const response = await api.patch<ApiResponse<object>>(`/decks/${deckId}/state`, { isInReview: inReview })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function toggleSaved(
  deckId: string,
  saved: boolean,
): Promise<void> {
  const response = await api.patch<ApiResponse<object>>(`/decks/${deckId}/state`, { isSaved: saved })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }
}

export async function cloneDeck(
  deckId: string,
): Promise<DeckDetailWithState> {
  const response = await api.post<ApiResponse<ApiDeckDetail>>(`/decks/${deckId}/clone`)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  const deck = response.data.data
  return {
    ...deck,
    isOwner: deck.userState?.isOwner ?? false,
    isBookmarked: deck.userState?.isBookmarked ?? false,
    isSaved: deck.userState?.isSaved ?? false,
    isInReview: deck.userState?.isInReview ?? false,
    learnedCards: deck.userState?.learnedCards ?? 0,
    reviewDue: deck.userState?.reviewDue ?? 0,
  }
}

export async function uploadDeckCover(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<ApiResponse<{ url: string }>>('/decks/cover-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (!response.data.success || !response.data.data?.url) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return normalizeDeckCoverUrl(response.data.data.url)
}

function normalizeDeckCoverUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim()
  if (!trimmed) return trimmed

  const baseURL = api.defaults.baseURL
  const apiOrigin =
    typeof baseURL === 'string' && /^https?:\/\//i.test(baseURL)
      ? new URL(baseURL).origin
      : null

  if (/^https?:\/\//i.test(trimmed)) {
    if (!apiOrigin) return trimmed

    const url = new URL(trimmed)
    const windowOrigin = typeof window !== 'undefined' ? window.location.origin : null

    if (windowOrigin && url.origin === windowOrigin && url.pathname.startsWith('/uploads/')) {
      return `${apiOrigin}${url.pathname}`
    }

    return trimmed
  }

  if (trimmed.startsWith('/') && apiOrigin) {
    return `${apiOrigin}${trimmed}`
  }

  return trimmed
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
