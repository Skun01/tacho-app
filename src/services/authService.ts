import type { ApiResponse } from '@/types/api'
import type { AuthDTO, LoginRequest, RegisterRequest } from '@/types/auth'
import { mockDataStore } from './mockDataStore'

export const authService = {
  login: (payload: LoginRequest) =>
    mockDataStore.login(payload) as Promise<{ data: ApiResponse<AuthDTO> }>,

  register: (payload: RegisterRequest) =>
    mockDataStore.register(payload) as Promise<{ data: ApiResponse<AuthDTO> }>,

  refresh: () =>
    mockDataStore.refresh() as Promise<{ data: ApiResponse<{ accessToken: string }> }>,

  logout: () =>
    mockDataStore.logout() as Promise<{ data: ApiResponse<null> }>,

  forgotPassword: (email: string) =>
    mockDataStore.forgotPassword(email),

  resetPassword: (token: string, password: string) =>
    mockDataStore.resetPassword(token, password),

  getCurrentUser: () => mockDataStore.getCurrentUser(),

  changePassword: (currentPassword: string, newPassword: string) =>
    mockDataStore.changePassword(currentPassword, newPassword),

  updateDisplayName: (name: string) =>
    mockDataStore.updateDisplayName(name),
}
