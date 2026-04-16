import { ERROR_MESSAGES } from '@/constants/errors'

interface ApiErrorData {
  code?: number
  Code?: number
  success?: boolean
  Success?: boolean
  message?: string | null
  Message?: string | null
  data?: unknown
  Data?: unknown
}

interface ApiError extends Error {
  apiData?: ApiErrorData
  response?: {
    data?: ApiErrorData
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallback = ERROR_MESSAGES.default,
): string {
  const err = error as ApiError
  const data = err?.apiData || err?.response?.data

  if (!data) {
    return fallback
  }

  const code = data.code ?? data.Code
  const message = data.message ?? data.Message
  const validationData = (data.data ?? data.Data) as Record<string, string[]> | undefined

  if (code === 400 && validationData && typeof validationData === 'object') {
    const firstError = Object.values(validationData)
      .flat()
      .find((msg) => Boolean(msg))

    if (firstError && ERROR_MESSAGES[firstError]) {
      return ERROR_MESSAGES[firstError]
    }
  }

  if (message && ERROR_MESSAGES[message]) {
    return ERROR_MESSAGES[message]
  }

  if (code === 400 && ERROR_MESSAGES.Validation_400) {
    return ERROR_MESSAGES.Validation_400
  }

  return fallback
}

