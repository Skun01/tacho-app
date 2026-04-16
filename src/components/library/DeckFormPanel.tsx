import { zodResolver } from '@hookform/resolvers/zod'
import { SpinnerGapIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DECK_COPY } from '@/constants/deck'
import { deckFormSchema, type DeckFormValues } from '@/lib/validations/deck'
import type { DeckDetailResponse, DeckTypeResponse } from '@/types/deck'

interface DeckFormPanelProps {
  title: string
  deckTypes: DeckTypeResponse[]
  initialValues?: Partial<DeckDetailResponse>
  submitLabel: string
  isPending?: boolean
  variant?: 'panel' | 'modal'
  onCancel?: () => void
  onSubmit: (values: DeckFormValues) => void
}

function getDefaultValues(initialValues?: Partial<DeckDetailResponse>): DeckFormValues {
  return {
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    coverImageUrl: initialValues?.coverImageUrl ?? '',
    visibility: initialValues?.visibility ?? 'Private',
    typeId: initialValues?.type?.id ?? '',
  }
}

export function DeckFormPanel({
  title,
  deckTypes,
  initialValues,
  submitLabel,
  isPending = false,
  variant = 'panel',
  onCancel,
  onSubmit,
}: DeckFormPanelProps) {
  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: getDefaultValues(initialValues),
  })

  useEffect(() => {
    form.reset(getDefaultValues(initialValues))
  }, [form, initialValues])

  return (
    <div className={variant === 'panel' ? 'rounded-3xl border border-border/70 bg-card/90 p-6' : 'p-6'}>
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{DECK_COPY.detailDescription}</p>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{DECK_COPY.deckTitleLabel}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={DECK_COPY.deckTitlePlaceholder} className="h-11 rounded-2xl bg-background" />
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
                <FormLabel>{DECK_COPY.deckDescriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder={DECK_COPY.deckDescriptionPlaceholder} className="rounded-2xl bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{DECK_COPY.deckCoverLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={DECK_COPY.deckCoverPlaceholder} className="h-11 rounded-2xl bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{DECK_COPY.deckTypeLabel}</FormLabel>
                  <FormControl>
                    <select
                      value={field.value ?? ''}
                      onChange={(event) => field.onChange(event.target.value)}
                      className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <option value="">{'Chưa phân loại'}</option>
                      {deckTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{DECK_COPY.deckVisibilityLabel}</FormLabel>
                <FormControl>
                  <select
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="Private">{DECK_COPY.visibilityLabels.Private}</option>
                    <option value="Public">{DECK_COPY.visibilityLabels.Public}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {DECK_COPY.cancel}
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending && <SpinnerGapIcon size={16} className="animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
