import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ArrowLeftIcon, ArrowRightIcon, XIcon, LightningIcon } from '@phosphor-icons/react'
import { VocabDetailView } from '@/components/card-detail/VocabDetailView'
import { GrammarDetailView } from '@/components/card-detail/GrammarDetailView'
import { getCardDetail } from '@/services/cardDetailService'
import { getStudyBatchIds } from '@/services/dashboardService'
import type { CardDetail } from '@/types/card'
import { StudyLoadingSkeleton } from '@/components/study/StudyLoadingSkeleton'

type StudyLocationState = {
  batchIds?: string[]
  mode?: 'learn' | 'review'
}

export function StudyPage() {
  const navigate = useNavigate()
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

  useEffect(() => {
    async function load() {
      const nextBatchIds = routeState?.batchIds?.length
        ? routeState.batchIds
        : await getStudyBatchIds(routeState?.mode ?? 'learn')
      setBatchIds(nextBatchIds)
      const results = await Promise.all(nextBatchIds.map((id) => getCardDetail(id)))
      setCards(results)
      setLoading(false)
    }
    void load()
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

  return (
    <div className="min-h-screen bg-surface-container-low">

      {/* ── Fixed top bar ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#1d1c13]/08 bg-background/90 px-4 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          aria-label="Thoát"
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container"
        >
          <XIcon size={18} />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-sm font-semibold text-foreground">Học thẻ</p>
          <p className="text-[11px] text-muted-foreground">
            {loading ? '…' : `${index + 1} / ${total} thẻ`}
          </p>
        </div>

        {/* placeholder right side to center title */}
        <div className="h-9 w-9" />
      </header>

      {/* ── Scrollable card content ── */}
      <main className="mx-auto max-w-4xl px-4 pb-32 pt-20">
        {loading ? (
          <StudyLoadingSkeleton />
        ) : current ? (
          <div
            key={index}
            className={`transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}
          >
            {current.type === 'vocab' ? (
              <VocabDetailView card={current} />
            ) : (
              <GrammarDetailView card={current} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <p className="text-sm">Không tìm thấy thẻ.</p>
          </div>
        )}
      </main>

      {/* ── Fixed bottom nav ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1d1c13]/08 bg-background/90 backdrop-blur-md">
        {/* progress bar */}
        <div className="h-1 bg-surface-container-highest">
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          {/* Previous */}
          <button
            onClick={prev}
            disabled={isFirst}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
              isFirst
                ? 'cursor-not-allowed text-muted-foreground/40'
                : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <ArrowLeftIcon size={15} />
            Trước
          </button>

          {/* Card counter */}
          <span className="text-sm font-semibold text-foreground">
            Thẻ {loading ? '…' : `${index + 1} / ${total}`}
          </span>

          {/* Next or Start exercise */}
          {isLast ? (
            <button
              onClick={() => navigate('/quiz', { state: { batchIds, mode: routeState?.mode ?? 'learn' } })}
              className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
            >
              <LightningIcon size={15} weight="fill" />
              Bắt đầu bài tập
            </button>
          ) : (
            <button
              onClick={next}
              className="flex items-center gap-1.5 rounded-2xl bg-surface-container px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-highest"
            >
              Tiếp
              <ArrowRightIcon size={15} />
            </button>
          )}
        </div>
      </nav>
    </div>
  )
}
