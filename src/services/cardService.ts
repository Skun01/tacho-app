import type { FlashCard, FlashCardWithProgress } from '@/types/card'
import { MOCK_CARDS_WITH_PROGRESS } from '@/mocks/cards'

/**
 * Search cards by query string.
 * Replace body with: return apiClient.get('/cards', { params: { q: query } })
 */
export async function searchCards(query: string): Promise<FlashCardWithProgress[]> {
  if (!query.trim()) return MOCK_CARDS_WITH_PROGRESS

  const q = query.toLowerCase()
  return MOCK_CARDS_WITH_PROGRESS.filter(
    (card) =>
      card.content.includes(q) ||
      (card.type === 'vocab' && card.reading.toLowerCase().includes(q)) ||
      card.meaning.toLowerCase().includes(q),
  )
}

/**
 * Fetch a single card by ID.
 * Replace body with: return apiClient.get(`/cards/${id}`)
 */
export async function getCard(id: string): Promise<FlashCardWithProgress | null> {
  return MOCK_CARDS_WITH_PROGRESS.find((c) => c.id === id) ?? null
}

/**
 * Fetch multiple cards by IDs.
 * Replace body with: return apiClient.get('/cards', { params: { ids } })
 */
export async function getCardsByIds(ids: string[]): Promise<FlashCard[]> {
  const idSet = new Set(ids)
  return MOCK_CARDS_WITH_PROGRESS.filter((c) => idSet.has(c.id))
}
