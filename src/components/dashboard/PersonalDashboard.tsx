import { DASHBOARD_PERSONAL } from '@/constants/dashboard'
import { ActivityChart } from './ActivityChart'
import { StreakCalendar } from './StreakCalendar'
import { JLPTStats } from './JLPTStats'

export function PersonalDashboard() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-primary">{DASHBOARD_PERSONAL.title}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-4">
          <ActivityChart />
          <StreakCalendar />
        </div>
        <JLPTStats />
      </div>
    </section>
  )
}
