import type { JlptLevel } from './card'

export type ActivityPoint = {
  date: string
  vocab: number
  grammar: number
}

export type StreakDay = {
  label: string
  active: boolean
}

export type DashboardSummary = {
  learn: {
    totalTarget: number
    completedCount: number
    batchIds: string[]
    decks: Array<{ id: string; name: string; due: number; batchIds: string[] }>
  }
  review: {
    totalDue: number
    vocab: number
    grammar: number
    batchIds: string[]
  }
  progress: {
    vocab: number[]
    grammar: number[]
  }
  personal: {
    activity: ActivityPoint[]
    streakDays: number
    streakCalendar: StreakDay[]
    jlpt: Record<'Từ vựng' | 'Ngữ pháp' | 'Cả hai', Array<{ current: number; total: number; done?: boolean; level: JlptLevel }>>
  }
}
