import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending } = useLogout()

  return (
    <>
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-6 p-8"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            Xin chào,
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--on-surface)', fontFamily: '"Kiwi Maru", serif' }}
          >
            {user?.displayName ?? '...'}
          </h1>
          <p
            className="text-sm"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            {user?.email}
          </p>
        </div>

        <button
          onClick={() => logout()}
          disabled={isPending}
          className="rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{
            background: 'linear-gradient(to right, var(--primary), var(--primary-container))',
            color: 'var(--surface)',
          }}
        >
          {isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>

        <p
          className="text-xs"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          🚧 Dashboard đang được xây dựng
        </p>
      </main>
    </>
  )
}