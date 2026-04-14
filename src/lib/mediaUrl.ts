const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

function getApiOrigin(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return new URL(API_BASE_URL, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) {
    return null
  }

  const trimmedUrl = url.trim()
  if (!trimmedUrl) {
    return null
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl
  }

  if (trimmedUrl.startsWith('//')) {
    if (typeof window === 'undefined') {
      return `https:${trimmedUrl}`
    }
    return `${window.location.protocol}${trimmedUrl}`
  }

  if (trimmedUrl.startsWith('/')) {
    const apiOrigin = getApiOrigin()
    return apiOrigin ? `${apiOrigin}${trimmedUrl}` : trimmedUrl
  }

  return trimmedUrl
}
