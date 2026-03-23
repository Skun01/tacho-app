import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { JLPTStats } from '@/components/dashboard/JLPTStats'
import { StreakCalendar } from '@/components/dashboard/StreakCalendar'
import { getDashboardSummary } from '@/services/dashboardService'
import { useAuthStore } from '@/stores/authStore'
import { PROFILE_COPY } from '@/constants/profile'
import type { DashboardSummary } from '@/types/dashboard'

const C = PROFILE_COPY

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    void getDashboardSummary().then(setSummary)
  }, [])

  const displayName = user?.displayName ?? '—'
  const email = user?.email ?? '—'
  const initials = displayName.slice(0, 2).toUpperCase()

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  const vocabLearned = summary
    ? summary.personal.jlpt['Từ vựng'].reduce((s, r) => s + r.current, 0)
    : null
  const grammarLearned = summary
    ? summary.personal.jlpt['Ngữ pháp'].reduce((s, r) => s + r.current, 0)
    : null
  const studyDays = summary
    ? summary.personal.streakCalendar.filter((d) => d.active).length
    : null

  const stats = summary
    ? [
        { label: C.stats.studyDays,    value: studyDays,      unit: C.stats.streakUnit },
        { label: C.stats.streak,        value: summary.personal.streakDays, unit: C.stats.streakUnit },
        { label: C.stats.vocabLearned,  value: vocabLearned,   unit: C.stats.wordUnit },
        { label: C.stats.grammarLearned, value: grammarLearned, unit: C.stats.grammarUnit },
      ]
    : []

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-16">
        {/* ── Header ── */}
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-xl font-bold text-background">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {C.joinedLabel} {joinedDate}
            </p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        {summary && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ label, value, unit }) => (
              <div
                key={label}
                className="flex flex-col gap-1 rounded-2xl bg-background p-4 shadow-[0_2px_12px_0_rgba(29,28,19,0.06)]"
              >
                <span className="text-xs text-muted-foreground">{label}</span>
                <p className="text-2xl font-bold text-primary">
                  {value ?? '—'}
                </p>
                <span className="text-xs text-muted-foreground">{unit}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Streak calendar ── */}
        {summary && (
          <StreakCalendar
            streakDays={summary.personal.streakDays}
            calendar={summary.personal.streakCalendar}
          />
        )}

        {/* ── JLPT Stats ── */}
        {summary && <JLPTStats jlpt={summary.personal.jlpt} />}

        {/* Skeleton placeholder while loading */}
        {!summary && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-surface-container"
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
