import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'tacho-theme'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else if (mode === 'light') {
    root.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  }
}

type ThemeStore = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  init: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'light',

  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme(mode)
    set({ mode })
  },

  init: () => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    const mode: ThemeMode = stored ?? 'light'
    applyTheme(mode)
    set({ mode })

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', (e) => {
        document.documentElement.classList.toggle('dark', e.matches)
      })
    }
  },
}))
