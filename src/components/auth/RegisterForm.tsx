import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { SpinnerGap } from '@phosphor-icons/react'
import { AUTH_REGISTER_COPY } from '@/constants/auth'
import { registerSchema, type RegisterSchema } from '@/lib/validations/auth'
import { useRegister } from '@/hooks/useAuth'
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

export function RegisterForm() {
  const { mutate: register_, isPending } = useRegister()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  })

  const onSubmit = (data: RegisterSchema) => {
    register_(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_REGISTER_COPY.displayNameLabel}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={AUTH_REGISTER_COPY.displayNamePlaceholder}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_REGISTER_COPY.emailLabel}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={AUTH_REGISTER_COPY.emailPlaceholder}
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
              <FormLabel>{AUTH_REGISTER_COPY.passwordLabel}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={AUTH_REGISTER_COPY.passwordPlaceholder}
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
          {isPending && <SpinnerGap size={16} className="animate-spin" />}
          {AUTH_REGISTER_COPY.submitButton}
        </Button>

        <p className="text-center text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {AUTH_REGISTER_COPY.loginPrompt}{' '}
          <Link
            to="/login"
            className="font-semibold hover:opacity-70"
            style={{ color: 'var(--primary)' }}
          >
            {AUTH_REGISTER_COPY.loginLink}
          </Link>
        </p>
      </form>
    </Form>
  )
}
