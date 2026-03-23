import { FlameIcon } from '@phosphor-icons/react'
import { DASHBOARD_PERSONAL } from '@/constants/dashboard'
import type { StreakDay } from '@/types/dashboard'

interface StreakCalendarProps {
  streakDays: number
  calendar: StreakDay[]
}

export function StreakCalendar({ streakDays, calendar }: StreakCalendarProps) {
  return (
    <div className="rounded-2xl bg-background p-5 shadow-[0_2px_16px_0_rgba(29,28,19,0.06)]">
      <div className="mb-4 flex items-center gap-2">
        <FlameIcon size={16} weight="fill" className="text-rose-500" />
        <h3 className="text-sm font-semibold text-foreground">
          {DASHBOARD_PERSONAL.streakLabel.replace('{n}', String(streakDays))}
        </h3>
      </div>

      <div className="flex items-end justify-between gap-2">
        {calendar.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            {day.active ? (
              <FlameIcon size={20} weight="fill" className="text-rose-500" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-surface-container" />
            )}
            <span className="text-[10px] text-muted-foreground">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
