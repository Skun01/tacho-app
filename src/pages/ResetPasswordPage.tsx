import { useSearchParams } from 'react-router'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { AUTH_RESET_PASSWORD_COPY } from '@/constants/auth'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <AuthLayout kanjiDecor={AUTH_RESET_PASSWORD_COPY.kanjiDecor}>
      <div className="w-full max-w-sm">
        {token && (
          <div className="mb-10 flex flex-col gap-2">
            <h1 className="font-kiwi text-3xl font-medium text-primary">
              {AUTH_RESET_PASSWORD_COPY.heading}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {AUTH_RESET_PASSWORD_COPY.subheading}
            </p>
          </div>
        )}
        <ResetPasswordForm token={token} />
      </div>
    </AuthLayout>
  )
}
