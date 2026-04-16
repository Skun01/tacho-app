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

  return (
    <div className="rounded-3xl border border-border/70 bg-card/90 p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{DECK_COPY.folderDescriptionPlaceholder}</p>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{DECK_COPY.folderTitleLabel}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={DECK_COPY.folderTitlePlaceholder} className="h-11 rounded-2xl bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{DECK_COPY.folderDescriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder={DECK_COPY.folderDescriptionPlaceholder} className="rounded-2xl bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              {DECK_COPY.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {DECK_COPY.saveSubmit}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

