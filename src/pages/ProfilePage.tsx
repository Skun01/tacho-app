import { PageHelmet } from '@/components/seo/PageHelmet'
import { Navbar } from '@/components/layout/Navbar'
import { ProfileHeader } from '@/components/layout/ProfileHeader'
import { UpdateProfileForm } from '@/components/auth/UpdateProfileForm'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { AUTH_PROFILE_COPY } from '@/constants/auth'

export function ProfilePage() {
  return (
    <>
      <PageHelmet
        title="Tài khoản"
        description="Quản lý thông tin tài khoản và bảo mật của bạn."
      />

      <Navbar />

      <main
        className="min-h-screen pt-16"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <ProfileHeader />

        <div className="mx-auto max-w-2xl px-6 lg:px-8 py-8 flex flex-col gap-10">

          <section>
            <h2
              className="mb-6 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {AUTH_PROFILE_COPY.profileSection}
            </h2>
            <UpdateProfileForm />
          </section>

          <div
            className="h-px"
            style={{ backgroundColor: 'var(--outline-variant)' }}
            role="separator"
          />

          <section>
            <h2
              className="mb-6 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {AUTH_PROFILE_COPY.securitySection}
            </h2>
            <ChangePasswordForm />
          </section>

        </div>
      </main>
    </>
  )
}
