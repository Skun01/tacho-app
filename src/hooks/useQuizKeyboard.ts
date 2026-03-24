import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { NavigateFunction } from 'react-router'
import type { AnswerState, QuizQuestion } from '@/types/quiz'

interface Params {
  answerState: AnswerState
  current: QuizQuestion | null
  inputRef: RefObject<HTMLInputElement | null>
  isCardFlipped: boolean
  onPlayAudio: () => void
  onNext: () => void
  onUndo: () => void
  onSeeAnswer: () => void
  onSelectChoice: (choiceId: string, isCorrect: boolean) => void
  onShowCardInfo: () => void
  onFlipCard: () => void
  onFlashcardAnswer: (correct: boolean) => void
  navigate: NavigateFunction
}

export function useQuizKeyboard({
  answerState,
  current,
  inputRef,
  isCardFlipped,
  onPlayAudio,
  onNext,
  onUndo,
  onSeeAnswer,
  onSelectChoice,
  onShowCardInfo,
  onFlipCard,
  onFlashcardAnswer,
  navigate,
}: Params) {
  const skipNextEnterRef = useRef(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // ── Enter: submit (guard via ref) or advance ──────────────────────────────
      if (e.key === 'Enter') {
        if (skipNextEnterRef.current) {
          skipNextEnterRef.current = false
          return
        }
        if (answerState !== 'idle') onNext()
        return
      }

      // ── Escape: exit quiz ─────────────────────────────────────────────────────
      if (e.key === 'Escape') {
        navigate(-1)
        return
      }

      // ── Space: toggle flip (Type D) or play audio ────────────────────────
      if (e.key === ' ') {
        e.preventDefault()
        if (current?.type === 'D') {
          onFlipCard()
        } else if (document.activeElement !== inputRef.current) {
          onPlayAudio()
        }
        return
      }

      // ── ArrowRight / ArrowLeft: Type D answer ───────────────────────────
      if (current?.type === 'D' && answerState === 'idle') {
        if (e.key === 'ArrowRight') { e.preventDefault(); onFlashcardAnswer(true); return }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); onFlashcardAnswer(false); return }
      }

      // ── 1–4: Type C choice selection ──────────────────────────────────────────
      if (/^[1-4]$/.test(e.key) && current?.type === 'C' && answerState === 'idle') {
        const choice = current.choices?.[Number(e.key) - 1]
        if (choice) onSelectChoice(choice.id, choice.isCorrect)
        return
      }

      // ── Backspace / z: undo (only when input is readonly i.e. answered) ───────
      if (
        (e.key === 'Backspace' || e.key === 'z') &&
        answerState !== 'idle' &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        onUndo()
        return
      }

      // ── s: see answer (wrong only) ────────────────────────────────────────────
      if (e.key === 's' && answerState === 'wrong') {
        onSeeAnswer()
        return
      }

      // ── i: view card info ─────────────────────────────────────────────────────
      if (e.key === 'i' && answerState !== 'idle') {
        onShowCardInfo()
        return
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answerState, current, inputRef, isCardFlipped, onPlayAudio, onNext, onUndo, onSeeAnswer, onSelectChoice, onShowCardInfo, onFlipCard, onFlashcardAnswer, navigate])

  return { skipNextEnterRef }
}
