import { useState, useEffect, useCallback, useRef, type MutableRefObject } from 'react'
import type { NavigateFunction } from 'react-router'
import { getCardDetail } from '@/services/cardDetailService'
import { getStudyBatchIds } from '@/services/dashboardService'
import { commitQuizProgress } from '@/services/cardService'
import { generateQuestion, checkAnswer } from '@/utils/quizGenerator'
import type { CardDetail } from '@/types/card'
import type { QuizQuestion, AnswerState, QuizAttempt } from '@/types/quiz'
import type { QuizForceType } from '@/constants/quiz'

type Phase = 'loading' | 'quiz'
type CardDisplayInfo = { content: string; reading?: string; jlptLevel: string }

export type QuizLocationState = {
  batchIds?: string[]
  mode?: 'learn' | 'review'
  forceType?: QuizForceType
}

export function useQuizSession(
  routeState: QuizLocationState | null,
  navigate: NavigateFunction,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cardInfosRef = useRef(new Map<string, CardDisplayInfo>()) as MutableRefObject<Map<string, CardDisplayInfo>>
  const cardInfoRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Phase>('loading')
  const [batchIds, setBatchIds] = useState<string[]>([])
  const [queue, setQueue] = useState<QuizQuestion[]>([])
  const [initialCount, setInitialCount] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [inputValue, setInputValue] = useState('')
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [masteryChanges, setMasteryChanges] = useState<Map<string, { before: number; after: number }>>(new Map())
  const [visible, setVisible] = useState(true)
  const [showCardInfo, setShowCardInfo] = useState(false)
  const [cardInfoData, setCardInfoData] = useState<CardDetail | null>(null)
  const [cardInfoLoading, setCardInfoLoading] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // ── Load ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const nextBatchIds = routeState?.batchIds?.length
        ? routeState.batchIds
        : await getStudyBatchIds(routeState?.mode ?? 'learn')
      setBatchIds(nextBatchIds)
      const cards = await Promise.all(nextBatchIds.map((id) => getCardDetail(id)))
      const valid = cards.filter((c): c is CardDetail => c !== null)
      const allMeanings = valid.map((c) => c.meaning)
      const ft = routeState?.forceType
      const resolvedType = !ft || ft === 'mixed' ? undefined : ft
      const questions = valid.map((c) => generateQuestion(c, allMeanings, resolvedType))
      questions.forEach((q) => {
        if (!cardInfosRef.current.has(q.cardId)) {
          cardInfosRef.current.set(q.cardId, {
            content: q.cardContent,
            reading: q.cardReading,
            jlptLevel: q.jlptLevel,
          })
        }
      })
      setQueue(questions)
      setInitialCount(questions.length)
      const mc = new Map<string, { before: number; after: number }>()
      valid.forEach((c) => {
        const stage = c.userProgress?.masteryStage ?? 0
        mc.set(c.id, { before: stage, after: stage })
      })
      setMasteryChanges(mc)
      setPhase('quiz')
    }
    void init()
  }, [routeState])

  // ── Scroll tracker ────────────────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() { setScrollY(window.scrollY) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const current = queue[0] ?? null

  // ── Auto-focus input ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (current?.type !== 'C') setTimeout(() => inputRef.current?.focus(), 100)
  }, [current?.id])

  // ── Derived values ────────────────────────────────────────────────────────────
  const currentMastery = current ? (masteryChanges.get(current.cardId)?.after ?? 0) : 0
  const pendingMastery =
    answerState === 'idle'
      ? currentMastery
      : Math.max(0, Math.min(14, currentMastery + (answerState === 'correct' ? 1 : -2)))
  const masteryDelta = pendingMastery - currentMastery
  const correctFirst = attempts.filter((a) => !a.wasRetry && a.correct).length
  const answeredFirst = attempts.filter((a) => !a.wasRetry).length
  const progressPct = initialCount > 0 ? (answeredFirst / initialCount) * 100 : 0

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleCheck = useCallback(() => {
    if (!current || answerState !== 'idle') return
    const correct = checkAnswer(current, inputValue)
    setAnswerState(correct ? 'correct' : 'wrong')
  }, [current, answerState, inputValue])

  function handleSelectChoice(choiceId: string, isCorrect: boolean) {
    if (answerState !== 'idle') return
    setSelectedChoiceId(choiceId)
    setAnswerState(isCorrect ? 'correct' : 'wrong')
  }

  function handleUndo() {
    setAnswerState('idle')
    setSelectedChoiceId(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleSeeAnswer() {
    if (!current) return
    setInputValue(current.correctAnswer)
    setAnswerState('correct')
  }

  async function handleNext() {
    if (!current) return
    const isCorrect = answerState === 'correct'

    setAttempts((prev) => [
      ...prev,
      { cardId: current.cardId, questionId: current.id, correct: isCorrect, wasRetry: current.isRetry },
    ])
    setMasteryChanges((prev) => {
      const existing = prev.get(current.cardId)!
      const after = Math.max(0, Math.min(14, existing.after + (isCorrect ? 1 : -2)))
      return new Map(prev).set(current.cardId, { ...existing, after })
    })

    const remaining = queue.slice(1)
    if (isCorrect && remaining.length === 0) {
      const nextAttempts = [
        ...attempts,
        { cardId: current.cardId, questionId: current.id, correct: true, wasRetry: current.isRetry },
      ]
      const finalMastery = new Map(masteryChanges)
      const ex = finalMastery.get(current.cardId)!
      finalMastery.set(current.cardId, { ...ex, after: Math.max(0, Math.min(14, ex.after + 1)) })
      await commitQuizProgress(
        Array.from(finalMastery.entries()).map(([cardId, mc]) => ({
          cardId,
          before: mc.before,
          after: mc.after,
        })),
      )
      navigate('/quiz/result', {
        state: {
          attempts: nextAttempts,
          totalCards: initialCount,
          batchIds,
          mode: routeState?.mode ?? 'learn',
          cardInfos: Array.from(finalMastery.entries()).map(([cardId, mc]) => ({
            cardId,
            content: cardInfosRef.current.get(cardId)?.content ?? cardId,
            reading: cardInfosRef.current.get(cardId)?.reading,
            jlptLevel: cardInfosRef.current.get(cardId)?.jlptLevel ?? '',
            before: mc.before,
            after: mc.after,
          })),
        },
      })
      return
    }

    setVisible(false)
    setTimeout(() => {
      if (isCorrect) {
        setQueue(remaining)
      } else {
        setQueue([...remaining, { ...current, id: `${current.id}-r`, isRetry: true }])
      }
      setAnswerState('idle')
      setInputValue('')
      setSelectedChoiceId(null)
      setAudioPlayed(false)
      setShowCardInfo(false)
      setCardInfoData(null)
      setVisible(true)
      window.scrollTo({ top: 0, behavior: 'instant' })
      setTimeout(() => inputRef.current?.focus(), 80)
    }, 150)
  }

  async function handleShowCardInfo() {
    if (showCardInfo && cardInfoData) {
      cardInfoRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (!current) return
    setShowCardInfo(true)
    setCardInfoLoading(true)
    const detail = await getCardDetail(current.cardId)
    setCardInfoData(detail)
    setCardInfoLoading(false)
    setTimeout(() => cardInfoRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return {
    phase,
    current,
    answerState,
    inputValue,
    setInputValue,
    selectedChoiceId,
    audioPlayed,
    setAudioPlayed,
    visible,
    showCardInfo,
    cardInfoData,
    cardInfoLoading,
    scrollY,
    initialCount,
    correctFirst,
    answeredFirst,
    progressPct,
    pendingMastery,
    masteryDelta,
    inputRef,
    cardInfoRef,
    handleCheck,
    handleSelectChoice,
    handleUndo,
    handleSeeAnswer,
    handleNext,
    handleShowCardInfo,
  }
}
