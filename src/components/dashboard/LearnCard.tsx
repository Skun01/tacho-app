import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CaretDownIcon, BookOpenTextIcon, GearIcon } from '@phosphor-icons/react'
import { DASHBOARD_LEARN } from '@/constants/dashboard'
import { SETTINGS_COPY } from '@/constants/settings'
import { useSettingsStore } from '@/stores/settingsStore'
import { gooeyToast } from 'goey-toast'
import type { DashboardSummary } from '@/types/dashboard'
import { LearnSettingsModal } from './LearnSettingsModal'

const RS = SETTINGS_COPY.review

interface Props {
  learn: DashboardSummary['learn']
}

export function LearnCard({ learn }: Props) {
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

  function handleOpenSettings(e: React.MouseEvent) {
    e.stopPropagation()
    if (!settingsOpen) {
      setLocalDaily(dailyNewCards)
      setLocalMax(maxCardsPerSession)
    }
    setSettingsOpen((v) => !v)
  }

  function handleSaveSettings() {
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

  function handleNavigate() {
    navigate('/study', { state: { batchIds: learn.batchIds, mode: 'learn' } })
  }

  return (
    <>
      <div
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
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
            <button
              onClick={handleOpenSettings}
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

      {settingsOpen && (
        <LearnSettingsModal
          localDaily={localDaily}
          localMax={localMax}
          onChangeDaily={handleLocalDaily}
          onChangeMax={handleLocalMax}
          onSave={handleSaveSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  )
}
