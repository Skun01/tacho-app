import { useEffect, useRef, useState } from 'react'
import { GearIcon } from '@phosphor-icons/react'
import { CARD_DETAIL_COPY, MASTERY_STAGES, MASTERY_STAGE_COLORS } from '@/constants/cardDetail'
import type { CardProgressDetail } from '@/types/card'

interface Props {
  progress: CardProgressDetail
  onUpdateStage: (stage: number) => void
  onReset: () => void
  onRemove: () => void
  onMarkMastered: () => void
}

function formatRelativeTime(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now()
  const abs = Math.abs(diff)
  const past = diff < 0
  if (abs < 60_000) return past ? 'vừa xong' : 'vài giây nữa'
  if (abs < 3_600_000) {
    const m = Math.round(abs / 60_000)
    return past ? `${m} phút trước` : `${m} phút nữa`
  }
  if (abs < 86_400_000) {
    const h = Math.round(abs / 3_600_000)
    return past ? `${h} giờ trước` : `${h} giờ nữa`
  }
  const d = Math.round(abs / 86_400_000)
  return past ? `${d} ngày trước` : `${d} ngày nữa`
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function ProgressCard({ progress, onUpdateStage, onReset, onRemove, onMarkMastered }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const stage = Math.max(0, Math.min(14, progress.masteryStage))
  const stageColor = MASTERY_STAGE_COLORS[stage]

  useEffect(() => {
    if (!menuOpen) return
    function outside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [menuOpen])

  return (
    <div className="rounded-2xl bg-background p-5 shadow-[0_2px_16px_0_rgba(29,28,19,0.08)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {CARD_DETAIL_COPY.progressTitle}
          </p>
          <p className={`mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-bold text-background ${stageColor}`}>
            {MASTERY_STAGES[stage]}
          </p>
        </div>

        {/* Settings ⚙ */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              menuOpen ? 'bg-surface-container' : 'hover:bg-surface-container'
            }`}
            aria-label={CARD_DETAIL_COPY.progressSettings}
          >
            <GearIcon size={16} className="text-secondary" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-30 min-w-[14rem] rounded-2xl bg-background py-1.5 shadow-[0_4px_24px_0_rgba(29,28,19,0.14)]">
              <SettingItem onClick={() => { onMarkMastered(); setMenuOpen(false) }}>
                {CARD_DETAIL_COPY.markMasteredAction}
              </SettingItem>
              <SettingItem onClick={() => { onRemove(); setMenuOpen(false) }}>
                {CARD_DETAIL_COPY.removeFromReview}
              </SettingItem>
              <div className="my-1 h-px bg-surface-container" />
              <SettingItem onClick={() => { onReset(); setMenuOpen(false) }} danger>
                {CARD_DETAIL_COPY.resetProgress}
              </SettingItem>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <Stat label={CARD_DETAIL_COPY.nextReview} value={formatRelativeTime(progress.nextReviewAt)} />
        <Stat label={CARD_DETAIL_COPY.firstLearned} value={formatDate(progress.firstLearnedAt)} />
        <Stat
          label={CARD_DETAIL_COPY.reviewCount}
          value={`${progress.reviewCount} ${CARD_DETAIL_COPY.reviewCountSuffix}`}
        />
      </div>

      {/* 15-stage bar */}
      <div className="flex gap-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <button
            key={i}
            title={MASTERY_STAGES[i]}
            onClick={() => onUpdateStage(i)}
            className={`h-2 flex-1 rounded-full transition-all hover:scale-y-150 ${
              i <= stage ? stageColor : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60">
        <span>Mới học</span>
        <span>Tinh thông</span>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-container-low px-2 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-foreground">{value}</p>
    </div>
  )
}

function SettingItem({
  onClick, children, danger = false,
}: { onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-container-low ${
        danger ? 'text-rose-600' : 'text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
