import { PageHelmet } from '@/components/seo/PageHelmet'
import { UpdateProfileForm } from '@/components/auth/UpdateProfileForm'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/authStore'
import { AUTH_PROFILE_COPY } from '@/constants/auth'

function getInitials(name: string | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <>
      <PageHelmet
        title="Tài khoản"
        description="Quản lý thông tin tài khoản và bảo mật của bạn."
      />

      <div
        className="min-h-screen pt-20 pb-16"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto max-w-2xl px-6 lg:px-8">

          {/* ── Avatar + basic info ──────────────────────────────────── */}
          <div className="flex items-center gap-5 py-10">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage
                src={user?.avatarUrl ?? undefined}
                alt={user?.displayName ?? 'User'}
              />
              <AvatarFallback
                className="text-xl font-bold"
                style={{
                  backgroundColor: 'var(--secondary-container)',
                  color: 'var(--on-secondary-container)',
                }}
              >
                {getInitials(user?.displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1
                className="font-heading-vn text-2xl"
                style={{ color: 'var(--on-surface)' }}
              >
                {user?.displayName}
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--on-surface-variant)' }}
              >
                {user?.email}
              </p>
            </div>
          </div>

          <Separator style={{ backgroundColor: 'var(--outline-variant)' }} />

          {/* ── Thông tin tài khoản ───────────────────────────────────── */}
          <section className="py-8">
            <h2
              className="mb-6 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {AUTH_PROFILE_COPY.profileSection}
            </h2>
            <UpdateProfileForm />
          </section>

          <Separator style={{ backgroundColor: 'var(--outline-variant)' }} />

          {/* ── Bảo mật ───────────────────────────────────────────────── */}
          <section className="py-8">
            <h2
              className="mb-6 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {AUTH_PROFILE_COPY.securitySection}
            </h2>
            <ChangePasswordForm />
          </section>
        </div>
      </div>
    </>
  )
}
