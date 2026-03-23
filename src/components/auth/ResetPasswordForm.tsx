import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { AUTH_RESET_PASSWORD_COPY } from '@/constants/auth'
import { resetPasswordSchema, type ResetPasswordSchema } from '@/lib/validations/auth'
import { PasswordInput } from '@/components/ui/password-input'
import { authService } from '@/services/authService'

interface ResetPasswordFormProps {
  token: string | null
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      if (!token) return
      await authService.resetPassword(token, data.password)
      setDone(true)
      gooeyToast.success(AUTH_RESET_PASSWORD_COPY.successToast)
    } catch {
      gooeyToast.error(AUTH_RESET_PASSWORD_COPY.errorToast)
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <WarningCircleIcon size={32} weight="fill" className="text-destructive" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-kiwi text-xl font-medium text-primary">
            {AUTH_RESET_PASSWORD_COPY.tokenErrorHeading}
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {AUTH_RESET_PASSWORD_COPY.tokenError}
          </p>
        </div>
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-primary transition-colors hover:underline"
        >
          {AUTH_RESET_PASSWORD_COPY.requestNewLink}
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container">
          <CheckCircleIcon size={32} weight="fill" className="text-secondary" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-kiwi text-xl font-medium text-primary">
            {AUTH_RESET_PASSWORD_COPY.successHeading}
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {AUTH_RESET_PASSWORD_COPY.successMessage}
          </p>
        </div>
        <Link
          to="/login"
          className="text-sm font-semibold text-primary transition-colors hover:underline"
        >
          {AUTH_RESET_PASSWORD_COPY.loginLink}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {AUTH_RESET_PASSWORD_COPY.passwordLabel}
        </label>
        <PasswordInput
          {...register('password')}
          placeholder={AUTH_RESET_PASSWORD_COPY.passwordPlaceholder}
        />
        {errors.password ? (
          <span className="text-xs text-destructive">{errors.password.message}</span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {AUTH_RESET_PASSWORD_COPY.passwordHint}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {AUTH_RESET_PASSWORD_COPY.confirmPasswordLabel}
        </label>
        <PasswordInput
          {...register('confirmPassword')}
          placeholder={AUTH_RESET_PASSWORD_COPY.confirmPasswordPlaceholder}
        />
        {errors.confirmPassword && (
          <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-primary-container py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting
          ? AUTH_RESET_PASSWORD_COPY.loadingButton
          : AUTH_RESET_PASSWORD_COPY.submitButton}
      </button>
    </form>
  )
}
