import type { CardDetail } from '@/types/card'
import { MOCK_VOCAB_DETAILS, MOCK_GRAMMAR_DETAILS } from '@/mocks/cardDetails'

/**
 * Fetch full card detail (vocab or grammar) by ID.
 * Replace body with: return apiClient.get(`/cards/${id}/detail`)
 */
export async function getCardDetail(id: string): Promise<CardDetail | null> {
  if (MOCK_VOCAB_DETAILS[id]) return MOCK_VOCAB_DETAILS[id]
  if (MOCK_GRAMMAR_DETAILS[id]) return MOCK_GRAMMAR_DETAILS[id]
  return null
}
