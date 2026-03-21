import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { CheckCircle } from '@phosphor-icons/react'
import { AUTH_FORGOT_PASSWORD_COPY } from '@/constants/auth'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/lib/validations/auth'

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (_data: ForgotPasswordSchema) => {
    // TODO: wire up authService.forgotPassword
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container">
          <CheckCircle size={32} weight="fill" className="text-secondary" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-['Kiwi_Maru'] text-xl font-medium text-primary">
            {AUTH_FORGOT_PASSWORD_COPY.successHeading}
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {AUTH_FORGOT_PASSWORD_COPY.successMessage}
          </p>
        </div>
        <Link
          to="/login"
          className="text-sm font-semibold text-primary transition-colors hover:underline"
        >
          {AUTH_FORGOT_PASSWORD_COPY.backToLogin}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {AUTH_FORGOT_PASSWORD_COPY.emailLabel}
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder={AUTH_FORGOT_PASSWORD_COPY.emailPlaceholder}
          className="border-b border-foreground/20 bg-transparent pb-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary"
        />
        {errors.email && (
          <span className="text-xs text-destructive">{errors.email.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-primary-container py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? AUTH_FORGOT_PASSWORD_COPY.loadingButton : AUTH_FORGOT_PASSWORD_COPY.submitButton}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-semibold text-primary transition-colors hover:underline">
          {AUTH_FORGOT_PASSWORD_COPY.backToLogin}
        </Link>
      </p>
    </form>
  )
}
