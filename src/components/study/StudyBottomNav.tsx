import { useNavigate } from 'react-router'
import { ArrowLeftIcon, ArrowRightIcon, LightningIcon } from '@phosphor-icons/react'
import { STUDY_COPY } from '@/constants/study'

const C = STUDY_COPY

interface StudyBottomNavProps {
  loading: boolean
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  progress: number
  batchIds: string[]
  routeMode: string
  prev: () => void
  next: () => void
}

/** Fixed bottom navigation với progress bar + Trước/Tiếp/Bắt đầu bài tập */
export function StudyBottomNav({
  loading,
  index,
  total,
  isFirst,
  isLast,
  progress,
  batchIds,
  routeMode,
  prev,
  next,
}: StudyBottomNavProps) {
  const navigate = useNavigate()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1d1c13]/08 bg-background/90 backdrop-blur-md">
      {/* Progress bar — dynamic width requires inline style */}
      <div className="h-1 bg-surface-container-highest">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
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
          {C.prevBtn}
        </button>

        <span className="text-sm font-semibold text-foreground">
          {loading ? C.cardPositionLoading : C.cardPosition(index + 1, total)}
        </span>

        {isLast ? (
          <button
            onClick={() => navigate('/quiz', { state: { batchIds, mode: routeMode } })}
            className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
          >
            <LightningIcon size={15} weight="fill" />
            {C.startQuizBtn}
          </button>
        ) : (
          <button
            onClick={next}
            className="flex items-center gap-1.5 rounded-2xl bg-surface-container px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-highest"
          >
            {C.nextBtn}
            <ArrowRightIcon size={15} />
          </button>
        )}
      </div>
    </nav>
  )
}
