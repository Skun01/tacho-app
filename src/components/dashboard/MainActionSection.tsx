import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CaretDownIcon, BookOpenTextIcon, ArrowsClockwiseIcon, GearIcon } from '@phosphor-icons/react'
import { DASHBOARD_LEARN, DASHBOARD_REVIEW } from '@/constants/dashboard'
import { SETTINGS_COPY } from '@/constants/settings'
import { useSettingsStore } from '@/stores/settingsStore'
import { gooeyToast } from 'goey-toast'
import type { DashboardSummary } from '@/types/dashboard'

const RS = SETTINGS_COPY.review

function LearnCard({ learn }: { learn: DashboardSummary['learn'] }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const today = learn.completedCount
  const batchSize = learn.totalTarget

  const dailyNewCards = useSettingsStore((s) => s.dailyNewCards)
  const maxCardsPerSession = useSettingsStore((s) => s.maxCardsPerSession)
  const setDailyNewCards = useSettingsStore((s) => s.setDailyNewCards)
  const setMaxCardsPerSession = useSettingsStore((s) => s.setMaxCardsPerSession)

  const [localDaily, setLocalDaily] = useState(dailyNewCards)
  const [localMax, setLocalMax] = useState(maxCardsPerSession)

  function handleSettingsToggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (!settingsOpen) {
      setLocalDaily(dailyNewCards)
      setLocalMax(maxCardsPerSession)
    }
    setSettingsOpen((v) => !v)
  }

  function handleSaveSettings(e: React.MouseEvent) {
    e.stopPropagation()
    setDailyNewCards(localDaily)
    setMaxCardsPerSession(localMax)
    gooeyToast.success(RS.savedToast)
    setSettingsOpen(false)
  }

  function handleLocalMax(v: number) {
    setLocalMax(Math.min(v, localDaily))
  }

  function handleLocalDaily(v: number) {
    setLocalDaily(v)
    if (localMax > v) setLocalMax(v)
  }

  return (
    <>
      <div
        onClick={() => navigate('/study', { state: { batchIds: learn.batchIds, mode: 'learn' } })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/study', { state: { batchIds: learn.batchIds, mode: 'learn' } })}
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

        {expanded ? (
          <div className="mt-3 flex flex-col gap-1 px-5 pb-3">
            {learn.decks.map((deck) => (
              <button
                key={deck.id}
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/study', { state: { batchIds: deck.batchIds, mode: 'learn', deckId: deck.id } })
                }}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-surface-container-low"
              >
                <span className="text-xs text-foreground">{deck.name}</span>
                <span className="text-xs text-muted-foreground">{deck.due} thẻ</span>
              </button>
            ))}
            {/* Settings gear — only visible when expanded */}
            <button
              onClick={(e) => { e.stopPropagation(); handleSettingsToggle(e) }}
              aria-label={RS.sectionTitle}
              className="mt-1 flex items-center gap-1.5 self-end rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
            >
              <GearIcon size={12} />
              {RS.sectionTitle}
            </button>
          </div>
        ) : (
          <div className="pb-5" />
        )}
      </div>

      {/* Modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleSettingsToggle(e) }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-[0_8px_40px_0_rgba(29,28,19,0.15)]">
            <h2 className="mb-5 text-base font-bold text-foreground">{RS.sectionTitle}</h2>

            <div className="flex flex-col gap-5">
              {/* Daily goal */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{RS.dailyNewLabel}</span>
                  <span className="text-sm font-bold text-primary">{localDaily}</span>
                </div>
                <input
                  type="range" min={5} max={50} step={5}
                  value={localDaily}
                  onChange={(e) => handleLocalDaily(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-muted-foreground">{RS.dailyNewDesc}</p>
              </div>

              {/* Max per session */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{RS.maxSessionLabel}</span>
                  <span className="text-sm font-bold text-primary">{localMax}</span>
                </div>
                <input
                  type="range" min={5} max={50} step={5}
                  value={localMax}
                  onChange={(e) => handleLocalMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-muted-foreground">{RS.maxSessionDesc}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSettingsToggle}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
              >
                {RS.saveBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ReviewCard({ review }: { review: DashboardSummary['review'] }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const dueCount = review.totalDue

  return (
    <div
      onClick={() => navigate('/quiz/config', { state: { batchIds: review.batchIds, mode: 'review' } })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/quiz/config', { state: { batchIds: review.batchIds, mode: 'review' } })}
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
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/quiz/config', { state: { batchIds: review.batchIds, mode: 'review', type: 'vocab' } })
            }}
            className="flex flex-1 flex-col gap-0.5 rounded-xl bg-background/60 p-3 transition-colors hover:bg-background/90"
          >
            <span className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.vocabLabel}</span>
            <span className="text-lg font-bold text-primary">{review.vocab}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/quiz/config', { state: { batchIds: review.batchIds, mode: 'review', type: 'grammar' } })
            }}
            className="flex flex-1 flex-col gap-0.5 rounded-xl bg-background/60 p-3 transition-colors hover:bg-background/90"
          >
            <span className="text-xs text-muted-foreground">{DASHBOARD_REVIEW.grammarLabel}</span>
            <span className="text-lg font-bold text-primary">{review.grammar}</span>
          </button>
        </div>
      ) : (
        <p className="px-5 pb-5 text-xs text-muted-foreground">{DASHBOARD_REVIEW.hint}</p>
      )}
    </div>
  )
}

interface MainActionSectionProps {
  learn: DashboardSummary['learn']
  review: DashboardSummary['review']
}

export function MainActionSection({ learn, review }: MainActionSectionProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
      <LearnCard learn={learn} />
      <ReviewCard review={review} />
    </div>
  )
}
