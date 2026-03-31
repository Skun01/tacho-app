import type { ApiResponse } from '@/types/api'
import type { AuthDTO, LoginRequest, RegisterRequest } from '@/types/auth'
import api from './api'

type ApiResult<T> = Promise<{ data: ApiResponse<T> }>

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<{ data: ApiResponse<T> }> {
  const response = await request
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'INTERNAL_SERVER_ERROR')
  }
  return response
}

export const authService = {
  login: (payload: LoginRequest) =>
    unwrap(api.post<ApiResponse<AuthDTO>>('/auth/login', payload) as ApiResult<AuthDTO>),

  register: (payload: RegisterRequest) =>
    unwrap(api.post<ApiResponse<AuthDTO>>('/auth/register', payload) as ApiResult<AuthDTO>),

  refresh: () =>
    unwrap(api.post<ApiResponse<AuthDTO>>('/auth/refresh-token') as ApiResult<AuthDTO>),

  logout: () =>
    unwrap(api.post<ApiResponse<null>>('/auth/logout') as ApiResult<null>),

  getMe: () =>
    unwrap(api.get<ApiResponse<AuthDTO['user']>>('/auth/me') as ApiResult<AuthDTO['user']>),

  forgotPassword: (email: string) =>
    unwrap(api.post<ApiResponse<null>>('/auth/forgot-password', { email }) as ApiResult<null>),

  resetPassword: (token: string, password: string) =>
    unwrap(api.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword: password }) as ApiResult<null>),

  changePassword: (currentPassword: string, newPassword: string) =>
    unwrap(api.patch<ApiResponse<boolean>>('/auth/change-password', { currentPassword, newPassword }) as ApiResult<boolean>),

  updateDisplayName: (name: string) =>
    unwrap(api.patch<ApiResponse<AuthDTO['user']>>('/auth/me/profile', { displayName: name }) as ApiResult<AuthDTO['user']>),
}
