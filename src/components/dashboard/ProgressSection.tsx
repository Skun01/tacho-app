import { useState } from 'react'
import { DASHBOARD_PROGRESS } from '@/constants/dashboard'
import type { DashboardSummary } from '@/types/dashboard'

const LEVEL_STYLES = [
  { bg: 'bg-primary', text: 'text-background', kanji: 'text-background/10' },
  { bg: 'bg-[#2b4545]', text: 'text-background', kanji: 'text-background/10' },
  { bg: 'bg-rose-100', text: 'text-rose-900', kanji: 'text-rose-200' },
  { bg: 'bg-violet-100', text: 'text-violet-900', kanji: 'text-violet-200' },
  { bg: 'bg-amber-50', text: 'text-amber-900', kanji: 'text-amber-200' },
]

interface ProgressSectionProps {
  progress: DashboardSummary['progress']
}

export function ProgressSection({ progress }: ProgressSectionProps) {
  const [activeTab, setActiveTab] = useState<'Ngữ pháp' | 'Từ vựng'>('Từ vựng')
  const counts = activeTab === 'Từ vựng' ? progress.vocab : progress.grammar

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{DASHBOARD_PROGRESS.title}</h2>
        <div className="flex items-center rounded-xl bg-surface-container p-1">
          {DASHBOARD_PROGRESS.tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary text-background shadow-sm'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {DASHBOARD_PROGRESS.levels.map((level, i) => {
          const style = LEVEL_STYLES[i]
          return (
            <div
              key={level.key}
              className={`relative overflow-hidden rounded-2xl p-4 ${style.bg}`}
            >
              <span
                className={`pointer-events-none absolute -right-2 -bottom-2 select-none font-kiwi text-5xl font-medium leading-none ${style.kanji}`}
              >
                {level.kanjiDecor}
              </span>
              <p className={`mb-2 text-[10px] font-bold tracking-widest ${style.text} opacity-70`}>
                {level.label}
              </p>
              <p className={`text-3xl font-bold ${style.text}`}>{counts[i]}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
