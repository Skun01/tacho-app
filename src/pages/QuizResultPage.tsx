import { useNavigate, useLocation } from 'react-router'
import { XIcon, TrophyIcon, ArrowRightIcon, HouseIcon, RepeatIcon } from '@phosphor-icons/react'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import type { QuizAttempt } from '@/types/quiz'

type CardInfo = {
  cardId: string
  content: string
  reading?: string
  jlptLevel: string
  before: number
  after: number
}

type ResultState = {
  attempts: QuizAttempt[]
  totalCards: number
  cardInfos: CardInfo[]
  batchIds?: string[]
  mode?: 'learn' | 'review'
}

const GRADES = [
  { min: 80, title: 'Xuất sắc!',  sub: 'Bạn đã làm rất tốt hôm nay!' },
  { min: 60, title: 'Tốt lắm!',   sub: 'Tiếp tục phấn đấu nhé!' },
  { min: 0,  title: 'Cố lên!',    sub: 'Ôn tập thêm để tiến bộ hơn nhé!' },
]

export function QuizResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as ResultState | null) ?? {
    attempts: [],
    totalCards: 0,
    cardInfos: [],
  }

  const { attempts, totalCards, cardInfos } = state
  const batchIds = state.batchIds ?? []
  const mode = state.mode ?? 'learn'
  const firstAttempts = attempts.filter((a) => !a.wasRetry)
  const correctOnFirst = firstAttempts.filter((a) => a.correct).length
  const wrongOnFirst   = firstAttempts.filter((a) => !a.correct).length
  const accuracy       = totalCards > 0 ? Math.round((correctOnFirst / totalCards) * 100) : 0
  const promoted       = cardInfos.filter((c) => c.after > c.before).length

  const grade = GRADES.find((g) => accuracy >= g.min) ?? GRADES[GRADES.length - 1]

  const accentColor =
    accuracy >= 80 ? 'text-emerald-600' : accuracy >= 60 ? 'text-amber-500' : 'text-rose-500'
  const accentBg =
    accuracy >= 80 ? 'bg-emerald-50'    : accuracy >= 60 ? 'bg-amber-50'    : 'bg-rose-50'
  const trophyHex =
    accuracy >= 80 ? '#059669'          : accuracy >= 60 ? '#d97706'        : '#f43f5e'

  const nextReview = new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between bg-background/90 px-4 backdrop-blur-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <XIcon size={15} />
        </button>
        <p className="text-sm font-semibold text-foreground">Kết quả bài kiểm tra</p>
        <div className="h-8 w-8" />
      </header>

      <div className="mx-auto max-w-md px-4 pb-16 pt-6">

        {/* ── Trophy + grade ── */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full ${accentBg}`}>
            <TrophyIcon size={42} weight="fill" style={{ color: trophyHex }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{grade.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{grade.sub}</p>
          </div>
        </div>

        {/* ── Accuracy big number ── */}
        <div className={`mb-4 rounded-3xl px-6 py-6 text-center ${accentBg}`}>
          <p className={`text-6xl font-bold tracking-tight ${accentColor}`}>{accuracy}%</p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">Độ chính xác</p>
        </div>

        {/* ── Stats row ── */}
        <div className="mb-6 grid grid-cols-4 gap-2">
          <StatCard label="Tổng"     value={totalCards}    />
          <StatCard label="Đúng"     value={correctOnFirst} color="text-emerald-600" />
          <StatCard label="Sai"      value={wrongOnFirst}  color="text-rose-500" />
          <StatCard label="Tăng bậc" value={promoted}      color="text-primary" />
        </div>

        {/* ── Per-card mastery changes ── */}
        {cardInfos.length > 0 && (
          <section className="mb-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Thay đổi bậc học
            </p>
            <div className="flex flex-col gap-2">
              {cardInfos.map((c) => (
                <MasteryRow key={c.cardId} card={c} />
              ))}
            </div>
          </section>
        )}

        {/* ── Next review ── */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-3.5">
          <div>
            <p className="text-xs text-muted-foreground">Ôn tập tiếp theo</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">Hôm nay lúc {nextReview}</p>
          </div>
          <span className="text-xl">🔔</span>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/study', { state: { batchIds, mode } })}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
          >
            Tiếp tục học
            <ArrowRightIcon size={15} />
          </button>
          <button
            onClick={() => navigate('/quiz', { state: { batchIds, mode } })}
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#1d1c13]/10 px-4 py-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
          >
            <RepeatIcon size={14} />
            Làm lại
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-container"
          >
            <HouseIcon size={14} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'text-foreground',
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="rounded-2xl bg-surface-container-low px-2 py-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}

function MasteryRow({ card }: { card: CardInfo }) {
  const delta   = card.after - card.before
  const rowBg   = delta > 0 ? 'bg-emerald-50/70' : delta < 0 ? 'bg-rose-50/60' : 'bg-surface-container-low'
  const deltaTx = delta > 0 ? 'text-emerald-600'  : delta < 0 ? 'text-rose-500'  : 'text-muted-foreground/50'
  const arrow   = delta > 0 ? '↑' : delta < 0 ? '↓' : '–'

  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${rowBg}`}>
      <div className="min-w-0 flex-1">
        <p className="truncate font-kiwi text-lg font-medium leading-tight text-foreground">
          {card.content}
        </p>
        {card.reading && (
          <p className="text-xs text-muted-foreground">{card.reading}</p>
        )}
      </div>
      <JlptBadge level={card.jlptLevel as any} />
      <p className={`shrink-0 text-xs font-semibold ${deltaTx}`}>
        {arrow} Bậc {card.before} → {card.after}
      </p>
    </div>
  )
}
