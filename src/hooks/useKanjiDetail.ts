import { useQuery } from '@tanstack/react-query'
import { kanjiService } from '@/services/kanjiService'

export const KANJI_QUERY_KEYS = {
  all: ['kanji'] as const,
  detail: (cardId: string) => ['kanji', 'detail', cardId] as const,
}

export function useKanjiDetail(cardId: string | undefined) {
  return useQuery({
    queryKey: KANJI_QUERY_KEYS.detail(cardId ?? ''),
    queryFn: async () => {
      if (!cardId) {
        throw new Error('INVALID_CARD_ID')
      }
      const response = await kanjiService.getDetail(cardId)
      return response
    },
    enabled: Boolean(cardId),
  })
}
