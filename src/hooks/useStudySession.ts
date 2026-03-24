import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router'
import { getCardDetail } from '@/services/cardDetailService'
import { getStudyBatchIds } from '@/services/dashboardService'
import type { CardDetail } from '@/types/card'

export type StudyLocationState = {
  batchIds?: string[]
  mode?: 'learn' | 'review'
}

interface UseStudySessionResult {
  index: number
  batchIds: string[]
  cards: (CardDetail | null)[]
  loading: boolean
  visible: boolean
  total: number
  isFirst: boolean
  isLast: boolean
  current: CardDetail | null | undefined
  progress: number
  routeMode: 'learn' | 'review'
  prev: () => void
  next: () => void
}

export function useStudySession(): UseStudySessionResult {
  const location = useLocation()
  const routeState = location.state as StudyLocationState | null

  const [index, setIndex] = useState(0)
  const [batchIds, setBatchIds] = useState<string[]>([])
  const [cards, setCards] = useState<(CardDetail | null)[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(true)

  const total = batchIds.length
  const isFirst = index === 0
  const isLast = index === total - 1
  const current = cards[index]
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0
  const routeMode = routeState?.mode ?? 'learn'

  useEffect(() => {
    async function load() {
      const nextBatchIds = routeState?.batchIds?.length
        ? routeState.batchIds
        : await getStudyBatchIds(routeMode)
      setBatchIds(nextBatchIds)
      const results = await Promise.all(nextBatchIds.map((id) => getCardDetail(id)))
      setCards(results)
      setLoading(false)
    }
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeState])

  function transition(to: number) {
    setVisible(false)
    setTimeout(() => {
      setIndex(to)
      setVisible(true)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 150)
  }

  const prev = useCallback(() => { if (!isFirst) transition(index - 1) }, [isFirst, index])
  const next = useCallback(() => { if (!isLast) transition(index + 1) }, [isLast, index])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight' && !isLast) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, isLast])

  return { index, batchIds, cards, loading, visible, total, isFirst, isLast, current, progress, routeMode, prev, next }
}
