import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { AUTH_LOGIN_COPY } from '@/constants/auth'

export function LoginPage() {
  return (
    <AuthLayout kanjiDecor={AUTH_LOGIN_COPY.kanjiDecor}>
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="font-kiwi text-3xl font-medium text-primary">
            {AUTH_LOGIN_COPY.heading}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {AUTH_LOGIN_COPY.subheading}
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  )
}