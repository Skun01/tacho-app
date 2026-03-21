import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { CaretDownIcon, BookOpenTextIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { DASHBOARD_LEARN, DASHBOARD_REVIEW } from '@/constants/dashboard'

const MOCK_DECKS = [
  { name: 'JLPT N5 - Từ vựng cơ bản', due: 5 },
  { name: 'Động từ nhóm 1', due: 4 },
]

const MOCK_REVIEW = { vocab: 28, grammar: 14 }

function LearnCard() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const today = 0
  const batchSize = 9

  return (
    <div
      onClick={() => navigate('/learn')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/learn')}
      className="flex cursor-pointer flex-col rounded-2xl bg-[#eaeff8] shadow-[0_2px_16px_0_rgba(29,28,19,0.06)] transition-shadow hover:shadow-[0_4px_24px_0_rgba(0,36,83,0.14)]"
    >
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/70">
            <BookOpenTextIcon size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{DASHBOARD_LEARN.title}</p>
            <p className="text-xs text-muted-foreground">
              {DASHBOARD_LEARN.subtitle.replace('{n}', String(batchSize))}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
          aria-label={DASHBOARD_LEARN.expandAriaLabel}
          className="flex items-center gap-1 text-sm font-semibold text-foreground"
        >
          <span>{today}/{batchSize}</span>
          <CaretDownIcon
            size={14}
            className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div className="px-5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-primary/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(today / batchSize) * 100}%` }}
          />
        </div>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-1 px-5 pb-4">
          {MOCK_DECKS.map((deck) => (
            <Link
              key={deck.name}
              to={`/learn?deck=${encodeURIComponent(deck.name)}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-surface-container-low"
            >
              <span className="text-xs text-foreground">{deck.name}</span>
              <span className="text-xs text-muted-foreground">{deck.due} thẻ</span>
            </Link>
          ))}
        </div>
      )}

      {!expanded && <div className="pb-5" />}
    </div>
  )
}

function ReviewCard() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const dueCount = 42

  return (
    <div
      onClick={() => navigate('/review')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/review')}
      className="flex cursor-pointer flex-col rounded-2xl bg-[#e5eff0] shadow-[0_2px_16px_0_rgba(29,28,19,0.06)] transition-shadow hover:shadow-[0_4px_24px_0_rgba(74,98,103,0.18)]"
    >
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/70">
            <ArrowsClockwiseIcon size={16} className="text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{DASHBOARD_REVIEW.title}</p>
            <p className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.subtitle}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v) }}
          aria-label={DASHBOARD_REVIEW.expandAriaLabel}
          className="flex items-center gap-1 text-sm font-semibold text-foreground"
        >
          <span>{dueCount}</span>
          <CaretDownIcon
            size={14}
            className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {expanded ? (
        <div className="flex gap-4 px-5 pb-4">
          <Link
            to="/review?type=vocab"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 flex-col gap-0.5 rounded-xl bg-background/60 p-3 transition-colors hover:bg-background/90"
          >
            <span className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.vocabLabel}</span>
            <span className="text-lg font-bold text-primary">{MOCK_REVIEW.vocab}</span>
          </Link>
          <Link
            to="/review?type=grammar"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 flex-col gap-0.5 rounded-xl bg-background/60 p-3 transition-colors hover:bg-background/90"
          >
            <span className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.grammarLabel}</span>
            <span className="text-lg font-bold text-primary">{MOCK_REVIEW.grammar}</span>
          </Link>
        </div>
      ) : (
        <p className="px-5 pb-5 text-xs text-muted-foreground">{DASHBOARD_REVIEW.hint}</p>
      )}
    </div>
  )
}

export function MainActionSection() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <LearnCard />
      <ReviewCard />
    </div>
  )
}
