import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getCardDetail } from '@/services/cardDetailService'
import type { CardDetail } from '@/types/card'

/**
 * Fetch card detail by route param :id.
 * Returns:
 *   undefined → loading
 *   null      → not found / no id
 *   CardDetail → loaded
 */
export function useCardDetail() {
  const { id } = useParams<{ id: string }>()
  const [card, setCard] = useState<CardDetail | null | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    getCardDetail(id).then(setCard)
  }, [id])

  return { card }
}
