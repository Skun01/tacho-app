import type { ApiResponse } from '@/types/api'
import type { GrammarCardDetail } from '@/types/grammar'
import api from './api'

export const grammarService = {
  async getDetail(cardId: string): Promise<ApiResponse<GrammarCardDetail>> {
    const response = await api.get<ApiResponse<GrammarCardDetail>>(`/grammar/${cardId}`)
    return response.data
  },
}
