import { AuthLayout } from '@/components/auth/AuthLayout'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { AUTH_FORGOT_PASSWORD_COPY } from '@/constants/auth'

export function ForgotPasswordPage() {
  return (
    <AuthLayout kanjiDecor={AUTH_FORGOT_PASSWORD_COPY.kanjiDecor}>
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="font-['Kiwi_Maru'] text-3xl font-medium text-primary">
            {AUTH_FORGOT_PASSWORD_COPY.heading}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {AUTH_FORGOT_PASSWORD_COPY.subheading}
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  )
}
