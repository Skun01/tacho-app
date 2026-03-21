import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { AUTH_REGISTER_COPY } from '@/constants/auth'

export function RegisterPage() {
  return (
    <AuthLayout kanjiDecor={AUTH_REGISTER_COPY.kanjiDecor}>
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="font-['Kiwi_Maru'] text-3xl font-medium text-primary">
            {AUTH_REGISTER_COPY.heading}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {AUTH_REGISTER_COPY.subheading}
          </p>
        </div>
        <RegisterForm />
      </div>
    </AuthLayout>
  )
}