import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { TypeBadge } from '@/components/ui/type-badge'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import { FuriganaText } from '@/components/ui/furigana-text'
import { SEARCH_COPY } from '@/constants/search'
import type { FlashCardWithProgress } from '@/types/card'

const MASTERY_COLORS = [
  'bg-surface-container-highest',
  'bg-rose-300',
  'bg-orange-300',
  'bg-yellow-300',
  'bg-lime-300',
  'bg-emerald-400',
]

interface Props {
  card: FlashCardWithProgress
  selectable: boolean
  isSelected: boolean
  onSelect: () => void
  onMarkPro: () => void
  onToggleSave: () => void
  onAddToDeck: () => void
  onResetProgress: () => void
  onAddToReview: () => void
}

export function SearchResultCard({
  card,
  selectable,
  isSelected,
  onSelect,
  onMarkPro,
  onToggleSave,
  onAddToDeck,
  onResetProgress,
  onAddToReview,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [menuOpen])

  const p = card.progress
  const isInReview = p?.isInReview ?? false
  const isSaved = p?.isSaved ?? false
  const masteryLevel = p?.masteryLevel ?? 0
  const isPro = masteryLevel === 5

  return (
    <li
      className={`flex items-start gap-3 rounded-2xl p-4 transition-colors ${
        selectable && isSelected
          ? 'bg-primary/5 ring-1 ring-primary/20'
          : 'bg-background hover:bg-surface-container-low'
      }`}
    >
      {/* Checkbox — only visible in select mode */}
      {selectable && (
        <button
          onClick={onSelect}
          className={`mt-0.5 shrink-0 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors ${
            isSelected
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/40 bg-transparent hover:border-primary/60'
          }`}
          aria-label={isSelected ? 'Bỏ chọn' : 'Chọn'}
        >
          {isSelected && <span className="block h-2 w-2 rounded-full bg-background" />}
        </button>
      )}

      {/* Main content — navigates to card detail */}
      <Link to={`/card/${card.id}`} className="flex-1 min-w-0 block" onClick={(e) => { if (selectable) e.preventDefault() }}>
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <TypeBadge type={card.type} />
          <JlptBadge level={card.jlptLevel} />
          {isPro && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              {SEARCH_COPY.proLabel}
            </span>
          )}
          {isInReview && !isPro && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {SEARCH_COPY.studyingLabel}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <FuriganaText text={card.content} className="font-kiwi text-base font-medium text-foreground" />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{card.meaning}</p>

        {/* Mastery dots */}
        {isInReview && (
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                  i < masteryLevel ? MASTERY_COLORS[masteryLevel] : MASTERY_COLORS[0]
                }`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Options ⋮ */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Tùy chọn"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            menuOpen ? 'bg-surface-container' : 'hover:bg-surface-container'
          }`}
        >
          <DotsThreeVerticalIcon size={16} className="text-muted-foreground" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 z-30 min-w-[13rem] rounded-2xl bg-background py-1.5 shadow-[0_4px_24px_0_rgba(29,28,19,0.14)]">
            <MenuItem onClick={() => { onMarkPro(); setMenuOpen(false) }}>
              {SEARCH_COPY.markPro}
            </MenuItem>
            <MenuItem onClick={() => { onToggleSave(); setMenuOpen(false) }}>
              {isSaved ? SEARCH_COPY.unsaveCard : SEARCH_COPY.saveCard}
            </MenuItem>
            <MenuItem onClick={() => { onAddToDeck(); setMenuOpen(false) }}>
              {SEARCH_COPY.addToDeck}
            </MenuItem>
            {!isInReview && (
              <MenuItem onClick={() => { onAddToReview(); setMenuOpen(false) }}>
                {SEARCH_COPY.addToReview}
              </MenuItem>
            )}
            {isInReview && (
              <>
                <div className="my-1 h-px bg-surface-container" />
                <MenuItem onClick={() => { onResetProgress(); setMenuOpen(false) }} danger>
                  {SEARCH_COPY.resetProgress}
                </MenuItem>
              </>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

function MenuItem({
  onClick,
  children,
  danger = false,
}: {
  onClick: () => void
  children: React.ReactNode
  danger?: boolean
}) {
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
