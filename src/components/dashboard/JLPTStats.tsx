import { useState } from 'react'
import { DASHBOARD_PERSONAL } from '@/constants/dashboard'
import type { DashboardSummary } from '@/types/dashboard'

interface JLPTStatsProps {
  jlpt: DashboardSummary['personal']['jlpt']
}

export function JLPTStats({ jlpt }: JLPTStatsProps) {
  const [activeTab, setActiveTab] = useState<'Từ vựng' | 'Ngữ pháp' | 'Cả hai'>('Từ vựng')
  const data = jlpt[activeTab]

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
        {data.map(({ level, current, total, done }) => {
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
