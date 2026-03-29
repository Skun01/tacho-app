import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileStatGrid } from '@/components/profile/ProfileStatGrid'
import { JLPTStats } from '@/components/dashboard/JLPTStats'
import { StreakCalendar } from '@/components/dashboard/StreakCalendar'
import { useProfileData } from '@/hooks/useProfileData'

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-container" />
      ))}
    </div>
  )
}

export function ProfilePage() {
  const { summary, stats, user, joinedDate } = useProfileData()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-16">
        <ProfileHeader user={user} joinedDate={joinedDate} />

        {summary ? (
          <>
            <ProfileStatGrid stats={stats} />
            <StreakCalendar
              streakDays={summary.personal.streakDays}
              calendar={summary.personal.streakCalendar}
            />
            <JLPTStats jlpt={summary.personal.jlpt} />
          </>
        ) : (
          <ProfileSkeleton />
        )}
      </div>
    </DashboardLayout>
  )
}
