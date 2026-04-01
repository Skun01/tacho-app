import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { AUTH_LOGIN_COPY } from '@/constants/auth'
import { loginSchema, type LoginSchema } from '@/lib/validations/auth'
import { useLogin } from '@/hooks/useAuth'
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

export function LoginForm() {
  const { mutate: login, isPending } = useLogin()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginSchema) => {
    login(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_LOGIN_COPY.emailLabel}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={AUTH_LOGIN_COPY.emailPlaceholder}
                  className="border-0 border-b border-foreground/40 rounded-none bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{AUTH_LOGIN_COPY.passwordLabel}</FormLabel>
                <Link
                  to="/forgot-password"
                  className="text-xs hover:opacity-70"
                  style={{ color: 'var(--secondary)' }}
                  tabIndex={-1}
                >
                  {AUTH_LOGIN_COPY.forgotPassword}
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder={AUTH_LOGIN_COPY.passwordPlaceholder}
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
          className="mt-2 gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
          {AUTH_LOGIN_COPY.submitButton}
        </Button>

        <p className="text-center text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {AUTH_LOGIN_COPY.registerPrompt}{' '}
          <Link
            to="/register"
            className="font-semibold hover:opacity-70"
            style={{ color: 'var(--primary)' }}
          >
            {AUTH_LOGIN_COPY.registerLink}
          </Link>
        </p>
      </form>
    </Form>
  )
}
