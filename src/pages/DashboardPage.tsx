import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { QuoteBanner } from '@/components/dashboard/QuoteBanner'
import { MainActionSection } from '@/components/dashboard/MainActionSection'
import { ProgressSection } from '@/components/dashboard/ProgressSection'
import { PersonalDashboard } from '@/components/dashboard/PersonalDashboard'
import { getDashboardSummary } from '@/services/dashboardService'
import type { DashboardSummary } from '@/types/dashboard'

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    void getDashboardSummary().then(setSummary)
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <QuoteBanner />
        {summary && (
          <>
            <MainActionSection learn={summary.learn} review={summary.review} />
            <ProgressSection progress={summary.progress} />
            <PersonalDashboard personal={summary.personal} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}