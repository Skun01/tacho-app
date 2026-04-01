import { useEffect } from 'react'
import { CircleNotch } from '@phosphor-icons/react'
import { useAuthStore } from '@/stores/authStore'

interface AppInitProps {
  children: React.ReactNode
}

/**
 * Gọi authStore.init() một lần khi app mount.
 * Hiện loading overlay toàn màn hình trong lúc chờ.
 */
export function AppInit({ children }: AppInitProps) {
  const init = useAuthStore((s) => s.init)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    init()
  }, [init])

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <CircleNotch
          size={32}
          weight="bold"
          className="animate-spin"
          style={{ color: 'var(--primary)' }}
        />
      </div>
    )
  }

  return <>{children}</>
}
