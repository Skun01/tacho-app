import type { CardDetail } from '@/types/card'
import { mockDataStore } from './mockDataStore'

/**
 * Fetch full card detail (vocab or grammar) by ID.
 * Replace body with: return apiClient.get(`/cards/${id}/detail`)
 */
export async function getCardDetail(id: string): Promise<CardDetail | null> {
  return mockDataStore.getCardDetail(id)
}
