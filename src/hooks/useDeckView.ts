import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getDeckDetail, toggleInReview, toggleSaved, cloneDeck } from '@/services/deckService'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { DECK_COPY } from '@/constants/deck'
import type { DeckDetailWithState } from '@/types/deck'

const C = DECK_COPY.viewPage

export function useDeckView(id: string | undefined) {
  const navigate = useNavigate()
  const [deck, setDeck] = useState<DeckDetailWithState | null>(null)
  const [inReview, setInReview] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!id) return
    getDeckDetail(id).then((d) => {
      setDeck(d)
      setInReview(d.isInReview)
      setSaved(d.isSaved)
    })
  }, [id])

  async function handleToggleReview() {
    if (!deck) return
    const next = !inReview
    await toggleInReview(deck.id, next)
    setInReview(next)
    setDeck((prev) => prev ? { ...prev, isInReview: next } : prev)
  }

  async function handleToggleSaved() {
    if (!deck) return
    const next = !saved
    await toggleSaved(deck.id, next)
    setSaved(next)
    setDeck((prev) => prev ? { ...prev, isSaved: next } : prev)
    if (next) gooeyToast.success(C.savedToast)
  }

  async function handleClone() {
    if (!deck) return
    const cloned = await cloneDeck(deck.id)
    gooeyToast.success(C.clonedToast)
    navigate(`/deck/${cloned.id}/edit`)
  }

  return { deck, inReview, saved, handleToggleReview, handleToggleSaved, handleClone }
}
