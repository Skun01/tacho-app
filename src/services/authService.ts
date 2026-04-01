import type { ApiResponse } from '@/types/api'
import type {
  AuthDTO,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UserDTO,
} from '@/types/auth'
import api from './api'

export const authService = {
  login: (payload: LoginRequest) =>
    api.post<ApiResponse<AuthDTO>>('/auth/login', payload),

  register: (payload: RegisterRequest) =>
    api.post<ApiResponse<AuthDTO>>('/auth/register', payload),

  refresh: () =>
    api.post<ApiResponse<AuthDTO>>('/auth/refresh'),

  logout: () =>
    api.post<ApiResponse<boolean>>('/auth/logout'),

  me: () =>
    api.get<ApiResponse<UserDTO>>('/auth/me'),

  updateProfile: (payload: UpdateProfileRequest) =>
    api.patch<ApiResponse<UserDTO>>('/auth/me/profile', payload),

  changePassword: (payload: ChangePasswordRequest) =>
    api.patch<ApiResponse<boolean>>('/auth/change-password', payload),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    api.post<ApiResponse<boolean>>('/auth/forgot-password', payload),

  resetPassword: (payload: ResetPasswordRequest) =>
    api.post<ApiResponse<boolean>>('/auth/reset-password', payload),
}
