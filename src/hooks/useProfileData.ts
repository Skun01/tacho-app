import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getDashboardSummary } from '@/services/dashboardService'
import { PROFILE_COPY } from '@/constants/profile'
import type { UserDTO } from '@/types/auth'
import type { DashboardSummary } from '@/types/dashboard'

const C = PROFILE_COPY

interface ProfileStat {
  label: string
  value: number | null
  unit: string
}

interface UseProfileDataResult {
  summary: DashboardSummary | null
  stats: ProfileStat[]
  user: UserDTO | null
  joinedDate: string
}

export function useProfileData(): UseProfileDataResult {
  const user = useAuthStore((state) => state.user)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    void getDashboardSummary().then(setSummary)
  }, [])

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric',
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

  const stats: ProfileStat[] = summary
    ? [
        { label: C.stats.studyDays,      value: studyDays,                         unit: C.stats.streakUnit  },
        { label: C.stats.streak,          value: summary.personal.streakDays,       unit: C.stats.streakUnit  },
        { label: C.stats.vocabLearned,    value: vocabLearned,                      unit: C.stats.wordUnit    },
        { label: C.stats.grammarLearned,  value: grammarLearned,                    unit: C.stats.grammarUnit },
      ]
    : []

  return { summary, stats, user, joinedDate }
}
