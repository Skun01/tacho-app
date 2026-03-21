import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { CaretLeftIcon, CaretRightIcon, GearIcon } from '@phosphor-icons/react'
import { DASHBOARD_PERSONAL } from '@/constants/dashboard'

const MOCK_DATA = [
  { date: '08 CN', vocab: 20, grammar: 12 },
  { date: '09 T2', vocab: 50, grammar: 18 },
  { date: '10 T3', vocab: 32, grammar: 48 },
  { date: '11 T4', vocab: 68, grammar: 28 },
  { date: '12 T5', vocab: 42, grammar: 62 },
  { date: '13 T6', vocab: 78, grammar: 38 },
  { date: '14 T7', vocab: 55, grammar: 70 },
  { date: '15 CN', vocab: 38, grammar: 50 },
]

export function ActivityChart() {
  const [_week, setWeek] = useState(0)

  return (
    <div className="rounded-2xl bg-background p-5 shadow-[0_2px_16px_0_rgba(29,28,19,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {DASHBOARD_PERSONAL.activityTitle}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeek((w) => w - 1)}
            className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-surface-container"
          >
            <CaretLeftIcon size={12} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => setWeek((w) => w + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-surface-container"
          >
            <CaretRightIcon size={12} className="text-muted-foreground" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-surface-container">
            <GearIcon size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">
            {DASHBOARD_PERSONAL.activityLegendVocab}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 rounded-full bg-rose-400" />
          <span className="text-xs text-muted-foreground">
            {DASHBOARD_PERSONAL.activityLegendGrammar}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={MOCK_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9a9486' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff9eb',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(29,28,19,0.1)',
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="vocab"
            stroke="#002453"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#002453' }}
          />
          <Line
            type="monotone"
            dataKey="grammar"
            stroke="#e07070"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#e07070' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
