export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  displayName: string
}

export interface UpdateProfileRequest {
  displayName: string
  avatarUrl?: string | null
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface UserDTO {
  id: string
  email: string
  displayName: string
  avatarUrl?: string | null
  role: 'user' | 'editor' | 'admin'
  createdAt: string
}

export interface AuthDTO {
  accessToken: string
  user: UserDTO
}
