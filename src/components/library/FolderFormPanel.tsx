import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DECK_COPY } from '@/constants/deck'
import { folderFormSchema, type FolderFormValues } from '@/lib/validations/deck'
import type { DeckFolderResponse } from '@/types/deck'

interface FolderFormPanelProps {
  title: string
  initialValues?: Partial<DeckFolderResponse>
  isPending?: boolean
  variant?: 'panel' | 'modal'
  onCancel: () => void
  onSubmit: (values: FolderFormValues) => void
}

function getDefaultValues(initialValues?: Partial<DeckFolderResponse>): FolderFormValues {
  return {
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
  }
}

export function FolderFormPanel({
  title,
  initialValues,
  isPending = false,
  variant = 'panel',
  onCancel,
  onSubmit,
}: FolderFormPanelProps) {
  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: getDefaultValues(initialValues),
  })

  useEffect(() => {
    form.reset(getDefaultValues(initialValues))
  }, [form, initialValues])

  const isModal = variant === 'modal'

  return (
    <div className={isModal ? 'p-0' : 'rounded-3xl border border-border/70 bg-card/90 p-6 dark:bg-surface-container-high'}>
      <div className={isModal ? 'border-b border-[#1d1c13]/8 px-6 py-4' : 'mb-6 space-y-1'}>
        <h2 className={isModal ? 'text-base font-bold text-foreground' : 'text-xl font-semibold text-foreground'}>
          {title}
        </h2>
        {!isModal && (
          <p className="text-sm text-muted-foreground">{DECK_COPY.folderDescriptionPlaceholder}</p>
        )}
      </div>

      <Form {...form}>
        <form className={isModal ? 'flex flex-col gap-5 p-6' : 'space-y-5'} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold">{DECK_COPY.folderTitleLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={DECK_COPY.folderTitlePlaceholder}
                    className={isModal ? 'h-10 rounded-xl border-0 bg-surface-container-low px-4 shadow-none focus-visible:bg-surface-container focus-visible:ring-0' : 'h-11 rounded-2xl bg-background'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold">{DECK_COPY.folderDescriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={isModal ? 3 : undefined}
                    placeholder={DECK_COPY.folderDescriptionPlaceholder}
                    className={isModal ? 'min-h-0 resize-none rounded-xl border-0 bg-surface-container-low px-4 py-2.5 shadow-none focus-visible:bg-surface-container focus-visible:ring-0' : 'rounded-2xl bg-background'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={isModal ? 'flex gap-3 pt-1' : 'flex flex-wrap justify-end gap-3'}>
            <Button
              type="button"
              variant={isModal ? 'secondary' : 'outline'}
              onClick={onCancel}
              className={isModal ? 'flex-1 rounded-xl py-2.5 text-sm font-semibold' : undefined}
            >
              {DECK_COPY.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={isModal ? 'flex-1 rounded-xl py-2.5 text-sm font-semibold' : undefined}
            >
              {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {DECK_COPY.saveSubmit}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
