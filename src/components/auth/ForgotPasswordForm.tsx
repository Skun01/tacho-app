import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { SpinnerGapIcon, EnvelopeSimpleIcon } from '@phosphor-icons/react'
import { AUTH_FORGOT_PASSWORD_COPY } from '@/constants/auth'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/lib/validations/auth'
import { useForgotPassword } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const { mutate: forgotPassword, isPending } = useForgotPassword()

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPassword(data, {
      onSuccess: () => setSent(true),
    })
  }

  // ─── Confirmation State ───────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--secondary-container)' }}
        >
          <EnvelopeSimpleIcon
            size={28}
            weight="duotone"
            style={{ color: 'var(--secondary)' }}
          />
        </div>
        <h2
          className="font-heading-vn text-lg"
          style={{ color: 'var(--on-surface)' }}
        >
          {AUTH_FORGOT_PASSWORD_COPY.successHeading}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--on-surface-variant)' }}
        >
          {AUTH_FORGOT_PASSWORD_COPY.successMessage}
        </p>
        <Link
          to="/login"
          className="mt-2 text-sm font-semibold hover:opacity-70"
          style={{ color: 'var(--primary)' }}
        >
          {AUTH_FORGOT_PASSWORD_COPY.successAction}
        </Link>
      </div>
    )
  }

  // ─── Form State ───────────────────────────────────────────────────────────
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_FORGOT_PASSWORD_COPY.emailLabel}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={AUTH_FORGOT_PASSWORD_COPY.emailPlaceholder}
                  className="border-0 border-b border-foreground/40 rounded-none bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
          {AUTH_FORGOT_PASSWORD_COPY.submitButton}
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm hover:opacity-70"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            ← {AUTH_FORGOT_PASSWORD_COPY.backToLogin}
          </Link>
        </div>
      </form>
    </Form>
  )
}
