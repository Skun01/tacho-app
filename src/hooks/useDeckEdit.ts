import { useEffect, useState } from 'react'
import { getDeckDetail } from '@/services/deckService'
import type { FlashCard } from '@/types/card'
import type { DeckDetailWithState } from '@/types/deck'

interface UseDeckEditResult {
  deck: DeckDetailWithState | null
  cards: FlashCard[]
  setCards: React.Dispatch<React.SetStateAction<FlashCard[]>>
  refreshDeck: () => Promise<void>
}

export function useDeckEdit(deckId: string | undefined): UseDeckEditResult {
  const [deck, setDeck] = useState<DeckDetailWithState | null>(null)
  const [cards, setCards] = useState<FlashCard[]>([])

  async function refreshDeck() {
    if (!deckId) return
    const nextDeck = await getDeckDetail(deckId)
    setDeck(nextDeck)
    setCards(nextDeck.cards)
  }

  useEffect(() => {
    void refreshDeck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId])

  return { deck, cards, setCards, refreshDeck }
}
