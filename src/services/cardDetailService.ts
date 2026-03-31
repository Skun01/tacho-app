import type { CardDetail } from '@/types/card'
import type { ApiResponse } from '@/types/api'
import api from './api'

/**
 * Fetch full card detail (vocab or grammar) by ID.
 * Replace body with: return apiClient.get(`/cards/${id}/detail`)
 */
export async function getCardDetail(id: string): Promise<CardDetail | null> {
  const response = await api.get<ApiResponse<CardDetail | null>>(`/cards/${id}/detail`)
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return response.data.data ?? null
}
