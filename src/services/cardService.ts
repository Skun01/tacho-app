import type { CardProgress, FlashCard, FlashCardWithProgress } from '@/types/card'
import type { ApiResponse } from '@/types/api'
import api from './api'
import { mockDataStore } from './mockDataStore'

/**
 * Search cards by query string.
 * Replace body with: return apiClient.get('/cards', { params: { q: query } })
 */
export async function searchCards(query: string): Promise<FlashCardWithProgress[]> {
  const response = await api.get<ApiResponse<FlashCardWithProgress[]>>('/cards', { params: { q: query } })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return response.data.data ?? []
}

/**
 * Fetch a single card by ID.
 * Replace body with: return apiClient.get(`/cards/${id}`)
 */
export async function getCard(id: string): Promise<FlashCardWithProgress | null> {
  const response = await api.get<ApiResponse<FlashCardWithProgress | null>>(`/cards/${id}`)
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return response.data.data ?? null
}

/**
 * Fetch multiple cards by IDs.
 * Replace body with: return apiClient.get('/cards', { params: { ids } })
 */
export async function getCardsByIds(ids: string[]): Promise<FlashCard[]> {
  const response = await api.get<ApiResponse<FlashCard[]>>('/cards', { params: { ids: ids.join(',') } })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return response.data.data ?? []
}

export async function updateCardProgress(
  id: string,
  patch: Partial<CardProgress>,
): Promise<FlashCardWithProgress> {
  const response = await api.patch<ApiResponse<FlashCardWithProgress>>(`/cards/${id}/progress`, patch)
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return response.data.data
}

export async function commitQuizProgress(
  changes: Array<{ cardId: string; before: number; after: number }>,
): Promise<void> {
  await mockDataStore.commitQuizProgress(changes)
}
