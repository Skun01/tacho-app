import { Navbar } from '@/components/layout/Navbar'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { useAuthStore } from '@/stores/authStore'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <>
      <PageHelmet
        title="Dashboard"
        description="Tổng quan học tập của bạn trên Tacho."
      />
      <Navbar />

      <main
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 pt-24"
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
            className="font-heading-vn text-2xl"
            style={{ color: 'var(--on-surface)' }}
          >
            {user?.displayName ?? '...'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
            {user?.email}
          </p>
        </div>

        <p className="text-xs mt-4" style={{ color: 'var(--on-surface-variant)' }}>
          🚧 Dashboard đang được xây dựng
        </p>
      </main>
    </>
  )
}