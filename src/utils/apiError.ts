import { API_ERROR_MESSAGES } from '@/types/api'
import type { AxiosError } from 'axios'

interface ApiErrorPayload {
  message?: string | null
}

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorPayload>
  const apiMessage = axiosError?.response?.data?.message
  if (apiMessage) {
    return API_ERROR_MESSAGES[apiMessage] ?? API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  }

  if (error instanceof Error) {
    return API_ERROR_MESSAGES[error.message] ?? API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  }

  return API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
}
