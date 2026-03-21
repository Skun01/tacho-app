import { useState } from 'react'
import { DASHBOARD_PERSONAL } from '@/constants/dashboard'

const MOCK_JLPT: Record<string, { current: number; total: number; done?: boolean }[]> = {
  'Từ vựng': [
    { current: 42, total: 3000 },
    { current: 300, total: 2000 },
    { current: 650, total: 1200 },
    { current: 480, total: 800 },
    { current: 800, total: 800, done: true },
  ],
  'Ngữ pháp': [
    { current: 5, total: 200 },
    { current: 40, total: 160 },
    { current: 80, total: 120 },
    { current: 90, total: 100 },
    { current: 100, total: 100, done: true },
  ],
  'Cả hai': [
    { current: 47, total: 3200 },
    { current: 340, total: 2160 },
    { current: 730, total: 1320 },
    { current: 570, total: 900 },
    { current: 900, total: 900, done: true },
  ],
}

const LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'] as const

export function JLPTStats() {
  const [activeTab, setActiveTab] = useState<'Từ vựng' | 'Ngữ pháp' | 'Cả hai'>('Từ vựng')
  const data = MOCK_JLPT[activeTab]

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-background p-5 shadow-[0_2px_16px_0_rgba(29,28,19,0.06)]">
      <h3 className="text-sm font-semibold text-foreground">{DASHBOARD_PERSONAL.jlptTitle}</h3>

      <div className="flex items-center rounded-xl bg-surface-container p-1">
        {DASHBOARD_PERSONAL.jlptTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-primary text-background shadow-sm'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {LEVELS.map((level, i) => {
          const { current, total, done } = data[i]
          const pct = Math.min((current / total) * 100, 100)
          return (
            <div key={level} className="flex items-center gap-3">
              <span className="w-6 shrink-0 text-xs font-bold text-foreground">{level}</span>
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                {done
                  ? `100% ${DASHBOARD_PERSONAL.jlptComplete}`
                  : `${current.toLocaleString()} / ${total.toLocaleString()}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
