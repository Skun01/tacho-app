import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { QuoteBanner } from '@/components/dashboard/QuoteBanner'
import { MainActionSection } from '@/components/dashboard/MainActionSection'
import { ProgressSection } from '@/components/dashboard/ProgressSection'
import { PersonalDashboard } from '@/components/dashboard/PersonalDashboard'

export function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <QuoteBanner />
        <MainActionSection />
        <ProgressSection />
        <PersonalDashboard />
      </div>
    </DashboardLayout>
  )
}