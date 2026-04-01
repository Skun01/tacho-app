import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { AUTH_ERROR_MESSAGES } from '@/constants/auth'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from '@/types/auth'
import { gooeyToast } from '@/components/ui/goey-toaster'

// ─── Error type từ setupInterceptors ─────────────────────────────────────────
interface ApiErrorData {
  code: number
  success: false
  message: string | null
  data: unknown
}

interface ApiError extends Error {
  apiData?: ApiErrorData
}

// ─── Helper: extract human-readable error message ────────────────────────────
function getErrorMessage(error: unknown): string {
  // Lỗi nghiệp vụ từ interceptor: error.apiData.message chứa mã lỗi (vd: "Email_Exist_409")
  const apiData = (error as ApiError)?.apiData
  if (apiData?.message && AUTH_ERROR_MESSAGES[apiData.message]) {
    return AUTH_ERROR_MESSAGES[apiData.message]
  }
  // Lỗi validation_400: message = "Validation_400", data chứa chi tiết field errors
  if (apiData?.code === 400) {
    return AUTH_ERROR_MESSAGES['Validation_400']
  }
  return AUTH_ERROR_MESSAGES.default
}

// ─── useLogin ─────────────────────────────────────────────────────────────────
export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: ({ data }) => {
      login(data.data.accessToken, data.data.user)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ─── useRegister ──────────────────────────────────────────────────────────────
export function useRegister() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: ({ data }) => {
      login(data.data.accessToken, data.data.user)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ─── useLogout ────────────────────────────────────────────────────────────────
export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      navigate('/', { replace: true })
    },
    onError: () => {
      // Dù lỗi hay không vẫn clear local state
      logout()
      navigate('/', { replace: true })
    },
  })
}

// ─── useForgotPassword ────────────────────────────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authService.forgotPassword(payload),
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
    // onSuccess xử lý ở component (hiện confirmation UI)
  })
}

// ─── useResetPassword ─────────────────────────────────────────────────────────
export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      authService.resetPassword(payload),
    onSuccess: () => {
      gooeyToast.success('Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.')
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ─── useChangePassword ────────────────────────────────────────────────────────
export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      authService.changePassword(payload),
    onSuccess: () => {
      gooeyToast.success('Mật khẩu đã được thay đổi thành công.')
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}

// ─── useUpdateProfile ─────────────────────────────────────────────────────────
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      authService.updateProfile(payload),
    onSuccess: ({ data }) => {
      setUser(data.data)
      gooeyToast.success('Thông tin đã được cập nhật.')
    },
    onError: (error) => {
      gooeyToast.error(getErrorMessage(error))
    },
  })
}
