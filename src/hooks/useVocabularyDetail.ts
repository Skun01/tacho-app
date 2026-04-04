import { useState, useEffect, useCallback } from 'react'
import { vocabularyService } from '@/services/vocabularyService'
import type { VocabularyCardDetail } from '@/types/vocabulary'

/**
 * Custom hook để fetch chi tiết từ vựng theo id.
 * Hỗ trợ refetch() để refresh data sau khi CRUD notes/likes.
 */
export function useVocabularyDetail(id: string | undefined) {
  const [card, setCard] = useState<VocabularyCardDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const fetchDetail = useCallback(async (cardId: string) => {
    const res = await vocabularyService.getDetail(cardId)
    if (res.success && res.data) {
      setCard(res.data)
      setNotFound(false)
    } else {
      setNotFound(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setNotFound(true)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setNotFound(false)
    setCard(null)

    vocabularyService.getDetail(id).then((res) => {
      if (cancelled) return
      if (res.success && res.data) {
        setCard(res.data)
      } else {
        setNotFound(true)
      }
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [id])

  /** Re-fetch current card (dùng sau CRUD notes/likes) */
  const refetch = useCallback(() => {
    if (id) {
      fetchDetail(id)
    }
  }, [id, fetchDetail])

  return { card, isLoading, notFound, refetch }
}
