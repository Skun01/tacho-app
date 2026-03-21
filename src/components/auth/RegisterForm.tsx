import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { AUTH_REGISTER_COPY } from '@/constants/auth'
import { registerSchema, type RegisterSchema } from '@/lib/validations/auth'
import { PasswordInput } from '@/components/ui/password-input'

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (_data: RegisterSchema) => {
    // TODO: wire up authService.register
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {AUTH_REGISTER_COPY.displayNameLabel}
        </label>
        <input
          {...register('displayName')}
          type="text"
          placeholder={AUTH_REGISTER_COPY.displayNamePlaceholder}
          className="border-b border-foreground/20 bg-transparent pb-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary"
        />
        {errors.displayName && (
          <span className="text-xs text-destructive">{errors.displayName.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {AUTH_REGISTER_COPY.emailLabel}
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder={AUTH_REGISTER_COPY.emailPlaceholder}
          className="border-b border-foreground/20 bg-transparent pb-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary"
        />
        {errors.email && (
          <span className="text-xs text-destructive">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {AUTH_REGISTER_COPY.passwordLabel}
        </label>
        <PasswordInput
          {...register('password')}
          placeholder={AUTH_REGISTER_COPY.passwordPlaceholder}
        />
        {errors.password ? (
          <span className="text-xs text-destructive">{errors.password.message}</span>
        ) : (
          <span className="text-xs text-muted-foreground">{AUTH_REGISTER_COPY.passwordHint}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-primary-container py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? AUTH_REGISTER_COPY.loadingButton : AUTH_REGISTER_COPY.submitButton}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {AUTH_REGISTER_COPY.loginPrompt}{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {AUTH_REGISTER_COPY.loginLink}
        </Link>
      </p>
    </form>
  )
}
