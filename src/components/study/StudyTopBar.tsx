import { useNavigate } from 'react-router'
import { XIcon } from '@phosphor-icons/react'
import { STUDY_COPY } from '@/constants/study'

const C = STUDY_COPY

interface StudyTopBarProps {
  loading: boolean
  index: number
  total: number
}

/** Fixed top bar với nút thoát, tiêu đề và counter */
export function StudyTopBar({ loading, index, total }: StudyTopBarProps) {
  const navigate = useNavigate()

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#1d1c13]/08 bg-background/90 px-4 backdrop-blur-md">
      <button
        onClick={() => navigate(-1)}
        aria-label={C.exitLabel}
        className="flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-surface-container"
      >
        <XIcon size={18} />
      </button>

      <div className="flex flex-col items-center gap-0.5">
        <p className="text-sm font-semibold text-foreground">{C.title}</p>
        <p className="text-[11px] text-muted-foreground">
          {loading ? C.cardCounterLoading : C.cardCounter(index + 1, total)}
        </p>
      </div>

      {/* Spacer để căn giữa title */}
      <div className="h-9 w-9" />
    </header>
  )
}
