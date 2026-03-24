import { useRef, useState } from 'react'
import { reorderCards } from '@/services/deckService'
import type { FlashCard } from '@/types/card'

interface UseDeckDragDropOptions {
  deckId: string | undefined
  cards: FlashCard[]
  setCards: React.Dispatch<React.SetStateAction<FlashCard[]>>
  onReorderComplete: () => Promise<void>
}

interface UseDeckDragDropResult {
  dragOver: number | null
  handleDragStart: (index: number) => void
  handleDragOver: (e: React.DragEvent, index: number) => void
  handleDrop: (index: number) => Promise<void>
  handleDragEnd: () => void
}

export function useDeckDragDrop({
  deckId,
  cards,
  setCards,
  onReorderComplete,
}: UseDeckDragDropOptions): UseDeckDragDropResult {
  const dragIndex = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  function handleDragStart(index: number) {
    dragIndex.current = index
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    setDragOver(index)
  }

  async function handleDrop(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) {
      setDragOver(null)
      return
    }
    const updated = [...cards]
    const [moved] = updated.splice(dragIndex.current, 1)
    updated.splice(index, 0, moved)
    setCards(updated)
    if (deckId) {
      await reorderCards(deckId, { orderedCardIds: updated.map((c) => c.id) })
      await onReorderComplete()
    }
    dragIndex.current = null
    setDragOver(null)
  }

  function handleDragEnd() {
    setDragOver(null)
  }

  return { dragOver, handleDragStart, handleDragOver, handleDrop, handleDragEnd }
}
