import { Navigate, useSearchParams } from 'react-router'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { BrandLogo } from '@/components/auth/BrandLogo'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { AUTH_RESET_PASSWORD_COPY } from '@/constants/auth'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return <Navigate to="/forgot-password" replace />
  }

  return (
    <>
      <PageHelmet
        title="Đặt lại mật khẩu"
        description="Tạo mật khẩu mới cho tài khoản Tacho của bạn."
      />
      <div
        className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <BrandLogo variant="dark" />
          </div>
          <div className="mb-8 flex flex-col gap-2">
            <h1
              className="font-heading-vn text-2xl"
              style={{ color: 'var(--on-surface)' }}
            >
              {AUTH_RESET_PASSWORD_COPY.heading}
            </h1>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              {AUTH_RESET_PASSWORD_COPY.subheading}
            </p>
          </div>
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </>
  )
}
