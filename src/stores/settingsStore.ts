import { create } from 'zustand'

const STORAGE_KEY = 'tacho-settings'

export type ReviewSettings = {
  dailyNewCards: number
  maxCardsPerSession: number
}

type SettingsStore = ReviewSettings & {
  setDailyNewCards: (v: number) => void
  setMaxCardsPerSession: (v: number) => void
}

const DEFAULTS: ReviewSettings = {
  dailyNewCards: 20,
  maxCardsPerSession: 40,
}

function loadStored(): ReviewSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) } as ReviewSettings
  } catch {
    return DEFAULTS
  }
}

function persist(partial: Partial<ReviewSettings>) {
  try {
    const current = loadStored()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }))
  } catch {}
}

export const useSettingsStore = create<SettingsStore>(() => ({
  ...loadStored(),

  setDailyNewCards: (v) => {
    const { maxCardsPerSession } = useSettingsStore.getState()
    const clampedMax = Math.min(maxCardsPerSession, v)
    persist({ dailyNewCards: v, maxCardsPerSession: clampedMax })
    useSettingsStore.setState({ dailyNewCards: v, maxCardsPerSession: clampedMax })
  },

  setMaxCardsPerSession: (v) => {
    const { dailyNewCards } = useSettingsStore.getState()
    const clamped = Math.min(v, dailyNewCards)
    persist({ maxCardsPerSession: clamped })
    useSettingsStore.setState({ maxCardsPerSession: clamped })
  },
}))
