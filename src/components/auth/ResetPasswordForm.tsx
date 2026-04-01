import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { AUTH_RESET_PASSWORD_COPY } from '@/constants/auth'
import { resetPasswordSchema, type ResetPasswordSchema } from '@/lib/validations/auth'
import { useResetPassword } from '@/hooks/useAuth'
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

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { mutate: resetPassword, isPending } = useResetPassword()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const onSubmit = (data: ResetPasswordSchema) => {
    resetPassword({ token, newPassword: data.newPassword })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_RESET_PASSWORD_COPY.newPasswordLabel}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={AUTH_RESET_PASSWORD_COPY.newPasswordPlaceholder}
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{AUTH_RESET_PASSWORD_COPY.confirmPasswordLabel}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={AUTH_RESET_PASSWORD_COPY.confirmPasswordPlaceholder}
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
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
          {AUTH_RESET_PASSWORD_COPY.submitButton}
        </Button>
      </form>
    </Form>
  )
}
