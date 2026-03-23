import { DASHBOARD_PERSONAL } from '@/constants/dashboard'
import type { DashboardSummary } from '@/types/dashboard'
import { ActivityChart } from './ActivityChart'
import { StreakCalendar } from './StreakCalendar'
import { JLPTStats } from './JLPTStats'

interface PersonalDashboardProps {
  personal: DashboardSummary['personal']
}

export function PersonalDashboard({ personal }: PersonalDashboardProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-primary">{DASHBOARD_PERSONAL.title}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-4">
          <ActivityChart activity={personal.activity} />
          <StreakCalendar streakDays={personal.streakDays} calendar={personal.streakCalendar} />
        </div>
        <JLPTStats jlpt={personal.jlpt} />
      </div>
    </section>
  )
}
