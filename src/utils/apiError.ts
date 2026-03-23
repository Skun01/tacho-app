import { API_ERROR_MESSAGES } from '@/types/api'

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return API_ERROR_MESSAGES[error.message] ?? API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  }

  return API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR
}
