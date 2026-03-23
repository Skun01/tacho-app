import type { CardProgress, FlashCard, FlashCardWithProgress } from '@/types/card'
import { mockDataStore } from './mockDataStore'

/**
 * Search cards by query string.
 * Replace body with: return apiClient.get('/cards', { params: { q: query } })
 */
export async function searchCards(query: string): Promise<FlashCardWithProgress[]> {
  return mockDataStore.searchCards(query)
}

/**
 * Fetch a single card by ID.
 * Replace body with: return apiClient.get(`/cards/${id}`)
 */
export async function getCard(id: string): Promise<FlashCardWithProgress | null> {
  return mockDataStore.getCard(id)
}

/**
 * Fetch multiple cards by IDs.
 * Replace body with: return apiClient.get('/cards', { params: { ids } })
 */
export async function getCardsByIds(ids: string[]): Promise<FlashCard[]> {
  return mockDataStore.getCardsByIds(ids)
}

export async function updateCardProgress(
  id: string,
  patch: Partial<CardProgress>,
): Promise<FlashCardWithProgress> {
  return mockDataStore.updateCardProgress(id, patch)
}

export async function commitQuizProgress(
  changes: Array<{ cardId: string; before: number; after: number }>,
): Promise<void> {
  await mockDataStore.commitQuizProgress(changes)
}
