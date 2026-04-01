import { create } from 'zustand'
import type { UserDTO } from '@/types/auth'

interface AuthState {
  token: string | null
  user: UserDTO | null
  isLoading: boolean
  setToken: (token: string) => void
  setUser: (user: UserDTO) => void
  login: (token: string, user: UserDTO) => void
  logout: () => void
  init: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setToken: (token) => set({ token }),

  setUser: (user) => set({ user }),

  login: (token, user) => set({ token, user, isLoading: false }),

  logout: () => set({ token: null, user: null, isLoading: false }),

  init: async () => {
    set({ isLoading: true })
    try {
      const { authService } = await import('@/services/authService')
      const { data } = await authService.refresh()
      // refresh trả về AuthDTO (accessToken + user)
      set({
        token: data.data.accessToken,
        user: data.data.user,
        isLoading: false,
      })
    } catch {
      set({ token: null, user: null, isLoading: false })
    }
  },
}))
