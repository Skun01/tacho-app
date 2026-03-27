import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { QuizForceType } from '@/constants/quiz'
import { getDeckDetail } from '@/services/deckService'

export function useQuickStudy() {
  const navigate = useNavigate()
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [quizType, setQuizType] = useState<QuizForceType>('C')
  const [starting, setStarting] = useState(false)

  function handleSelectDeck(id: string) {
    setSelectedDeckId((prev) => (prev === id ? null : id))
  }

  function handleSelectType(type: QuizForceType) {
    setQuizType(type)
  }

  async function handleStart() {
    if (!selectedDeckId || starting) return
    setStarting(true)
    try {
      const deck = await getDeckDetail(selectedDeckId)
      const cardIds = deck.cards.map((c) => c.id)
      navigate('/quiz', {
        state: {
          batchIds: cardIds,
          forceType: quizType,
          mode: 'learn',
        },
      })
    } finally {
      setStarting(false)
    }
  }

  return {
    selectedDeckId,
    quizType,
    starting,
    handleSelectDeck,
    handleSelectType,
    handleStart,
  }
}
