import { useState, useEffect, useRef, type MutableRefObject } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { FuriganaText } from '@/components/ui/furigana-text'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import type { QuizQuestion } from '@/types/quiz'
import { QUIZ_COPY } from '@/constants/quiz'

const C = QUIZ_COPY
const SWIPE_THRESHOLD = 100

// Card dimensions
const CARD_HEIGHT = 260
const STACK_OFFSET = 10 // px each layer shifts down

interface Props {
  cards: QuizQuestion[]
  isFlipped: boolean
  onFlip: () => void
  onSwipe: (correct: boolean) => void
  totalCards: number
  answeredCount: number
}

interface TopCardProps {
  question: QuizQuestion
  isFlipped: boolean
  onFlip: () => void
  onSwipe: (correct: boolean) => void
  triggerRef: MutableRefObject<((correct: boolean) => void) | null>
}

function TopCard({ question, isFlipped, onFlip, onSwipe, triggerRef }: TopCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-280, 280], [-14, 14])
  const rightBadgeOpacity = useTransform(x, [20, 110], [0, 1])
  const leftBadgeOpacity = useTransform(x, [-110, -20], [1, 0])
  const controls = useAnimation()

  const [flipReady, setFlipReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setFlipReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  async function flyOut(correct: boolean) {
    await controls.start({
      x: correct ? 600 : -600,
      rotate: correct ? 22 : -22,
      opacity: 0,
      transition: { duration: 0.26, ease: 'easeOut' },
    })
    onSwipe(correct)
  }

  // Expose flyOut so the action buttons can trigger same animation
  triggerRef.current = flyOut

  async function handleDragEnd(_: never, info: { offset: { x: number } }) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      await flyOut(true)
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      await flyOut(false)
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: 'spring', stiffness: 340, damping: 30 },
      })
    }
  }

  return (
    <motion.div
      style={{ x, rotate, zIndex: 30, height: CARD_HEIGHT }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      animate={controls}
      onDragEnd={handleDragEnd}
      className="absolute inset-x-0 top-0 cursor-grab touch-none active:cursor-grabbing"
    >
      {/* ── Đã nhớ badge ── */}
      <motion.div
        style={{ opacity: rightBadgeOpacity }}
        className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white shadow-md"
      >
        <CheckIcon size={16} weight="bold" />
        {C.flashcardSwipeRight}
      </motion.div>

      {/* ── Chưa nhớ badge ── */}
      <motion.div
        style={{ opacity: leftBadgeOpacity }}
        className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-1.5 text-sm font-bold text-white shadow-md"
      >
        <XIcon size={16} weight="bold" />
        {C.flashcardSwipeLeft}
      </motion.div>

      {/* ── Flip card ── */}
      <div
        className="h-full w-full select-none"
        style={{ perspective: '1200px' }}
        onClick={onFlip}
      >
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: flipReady ? 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' : 'none',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-background px-8 shadow-[0_4px_32px_0_rgba(29,28,19,0.10)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <JlptBadge level={question.jlptLevel as any} />
            <FuriganaText
              text={question.cardContent}
              className="font-kiwi text-5xl font-medium tracking-wide text-foreground"
            />
            <p className="text-[11px] text-muted-foreground/40">{C.flashcardFlipHint}</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-surface-container-low px-8 shadow-[0_4px_32px_0_rgba(29,28,19,0.10)]"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <FuriganaText
              text={question.cardContent}
              className="font-kiwi text-2xl font-medium tracking-wide text-muted-foreground/55"
            />
            {question.cardReading && (
              <p className="text-[22px] font-semibold text-primary">{question.cardReading}</p>
            )}
            <div className="h-px w-14 bg-[#1d1c13]/10" />
            <p className="text-center text-lg font-bold text-foreground">{question.cardMeaning}</p>
            {question.promptSentence && (
              <div className="mt-2 max-w-xs rounded-2xl bg-background/70 px-4 py-2.5 text-center">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/35">
                  {C.flashcardExampleLabel}
                </p>
                <FuriganaText
                  text={question.promptSentence}
                  className="font-kiwi text-sm leading-relaxed text-foreground/70"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FlashcardStack({ cards, isFlipped, onFlip, onSwipe, totalCards, answeredCount }: Props) {
  const triggerRef = useRef<((correct: boolean) => void) | null>(null)
  const numBehind = Math.min(cards.length - 1, 2)
  const containerHeight = CARD_HEIGHT + numBehind * STACK_OFFSET

  function handleButtonSwipe(correct: boolean) {
    triggerRef.current?.(correct)
  }

  if (cards.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3" style={{ height: CARD_HEIGHT }}>
        <p className="text-sm text-muted-foreground">{C.flashcardEmpty}</p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-5">
      {/* Counter */}
      <p className="text-xs font-medium text-muted-foreground/50">
        {answeredCount + 1} / {totalCards}
      </p>

      {/* Stack */}
      <div className="relative w-full" style={{ height: containerHeight }}>
        {/* Layer 3 (deepest) */}
        {cards.length >= 3 && (
          <div
            className="absolute inset-x-4 rounded-3xl bg-surface-container shadow-[0_2px_12px_0_rgba(29,28,19,0.06)]"
            style={{ top: STACK_OFFSET * 2, height: CARD_HEIGHT, zIndex: 10 }}
          />
        )}
        {/* Layer 2 */}
        {cards.length >= 2 && (
          <div
            className="absolute inset-x-2 rounded-3xl bg-surface-container-low shadow-[0_2px_16px_0_rgba(29,28,19,0.07)]"
            style={{ top: STACK_OFFSET, height: CARD_HEIGHT, zIndex: 20 }}
          />
        )}

        {/* Top card — draggable */}
        <TopCard
          key={cards[0].id}
          question={cards[0]}
          isFlipped={isFlipped}
          onFlip={onFlip}
          onSwipe={onSwipe}
          triggerRef={triggerRef}
        />
      </div>

      {/* Drag hint */}
      <p className="text-[11px] text-muted-foreground/35">{C.flashcardDragHint}</p>

      {/* Action buttons */}
      <div className="flex w-full gap-3">
        <button
          onClick={() => handleButtonSwipe(false)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-50 py-4 text-sm font-bold text-rose-500 shadow-sm transition-all hover:bg-rose-100 active:scale-95"
        >
          <XIcon size={18} weight="bold" />
          {C.flashcardSwipeLeft}
        </button>
        <button
          onClick={() => handleButtonSwipe(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-4 text-sm font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 active:scale-95"
        >
          <CheckIcon size={18} weight="bold" />
          {C.flashcardSwipeRight}
        </button>
      </div>
    </div>
  )
}
