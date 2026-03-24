import { CARD_TYPE } from '@/types/card'
import type { FlashCard, CardType } from '@/types/card'

/**
 * Filter cards by a search string across content, reading (vocab only), and meaning.
 */
export function filterCards(cards: FlashCard[], search: string): FlashCard[] {
  if (!search) return cards
  const lower = search.toLowerCase()
  return cards.filter(
    (c) =>
      c.content.includes(search) ||
      (c.type === CARD_TYPE.VOCAB ? c.reading : '').includes(search) ||
      c.meaning.toLowerCase().includes(lower),
  )
}

/**
 * Count cards matching a given type.
 */
export function countByType(cards: FlashCard[], type: CardType): number {
  return cards.filter((c) => c.type === type).length
}
