import type { ApiResponse } from '@/types/api'
import type { KanjiCardDetail } from '@/types/kanji'
import api from './api'

export const kanjiService = {
  async getDetail(cardId: string): Promise<ApiResponse<KanjiCardDetail>> {
    const response = await api.get<ApiResponse<KanjiCardDetail>>(`/kanji/${cardId}`)
    return response.data
  },
}
