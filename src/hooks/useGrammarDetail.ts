import { useQuery } from '@tanstack/react-query'
import { grammarService } from '@/services/grammarService'

export const GRAMMAR_QUERY_KEYS = {
  all: ['grammar'] as const,
  detail: (cardId: string) => ['grammar', 'detail', cardId] as const,
}

export function useGrammarDetail(cardId: string | undefined) {
  return useQuery({
    queryKey: GRAMMAR_QUERY_KEYS.detail(cardId ?? ''),
    queryFn: async () => {
      if (!cardId) {
        throw new Error('INVALID_CARD_ID')
      }
      const response = await grammarService.getDetail(cardId)
      return response
    },
    enabled: Boolean(cardId),
  })
}
