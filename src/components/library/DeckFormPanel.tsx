import { zodResolver } from '@hookform/resolvers/zod'
import { GlobeHemisphereWestIcon, ImageIcon, LockSimpleIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DECK_COPY } from '@/constants/deck'
import { resolveMediaUrl } from '@/lib/mediaUrl'
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
  onSubmit: (values: DeckFormValues) => void | Promise<void>
}

function getDefaultValues(initialValues?: Partial<DeckDetailResponse>): DeckFormValues {
  return {
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    coverImageFile: null,
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

  const isSubmitting = form.formState.isSubmitting || isPending
  const isModal = variant === 'modal'

  return (
    <div className={isModal ? 'p-0' : 'rounded-3xl border border-border/70 bg-card/90 p-6 dark:bg-surface-container-high'}>
      <div className={isModal ? 'border-b border-[#1d1c13]/8 px-6 py-4' : 'mb-6 space-y-1'}>
        <h2 className={isModal ? 'text-base font-bold text-foreground' : 'text-xl font-semibold text-foreground'}>
          {title}
        </h2>
        {!isModal && (
          <p className="text-sm text-muted-foreground">{DECK_COPY.detailDescription}</p>
        )}
      </div>

      <Form {...form}>
        <form className={isModal ? 'flex flex-col gap-5 p-6' : 'space-y-5'} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="coverImageFile"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                {!isModal && <FormLabel>{DECK_COPY.deckCoverLabel}</FormLabel>}
                <FormControl>
                  <div className={isModal ? '' : 'space-y-3'}>
                    <ImageUpload
                      value={field.value ?? null}
                      onChange={(file) => field.onChange(file)}
                      defaultPreview={resolveMediaUrl(initialValues?.coverImageUrl) ?? undefined}
                      className={isModal ? '[&_label]:h-32 [&_.aspect-video]:aspect-[2.2/1]' : undefined}
                    />
                    {!isModal && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ImageIcon size={14} />
                        <span>{DECK_COPY.imageUploadHint}</span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold">{DECK_COPY.deckTitleLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={DECK_COPY.deckTitlePlaceholder}
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
                <FormLabel className="text-xs font-semibold">{DECK_COPY.deckDescriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={isModal ? 3 : undefined}
                    placeholder={DECK_COPY.deckDescriptionPlaceholder}
                    className={isModal ? 'min-h-0 resize-none rounded-xl border-0 bg-surface-container-low px-4 py-2.5 shadow-none focus-visible:bg-surface-container focus-visible:ring-0' : 'rounded-2xl bg-background'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={isModal ? 'space-y-5' : 'grid gap-5 lg:grid-cols-2'}>
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className="text-xs font-semibold">{DECK_COPY.deckTypeLabel}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || '__none__'}
                      onValueChange={(value) => field.onChange(value === '__none__' ? '' : value)}
                    >
                      <SelectTrigger className={isModal ? 'h-10 rounded-xl border-0 bg-surface-container-low shadow-none focus:ring-0' : undefined}>
                        <SelectValue placeholder={DECK_COPY.deckTypePlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{DECK_COPY.deckTypeEmpty}</SelectItem>
                        {deckTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold">{DECK_COPY.deckVisibilityLabel}</FormLabel>
                <FormControl>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => field.onChange('Private')}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        field.value === 'Private'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                          : isModal
                            ? 'border-transparent bg-surface-container-low hover:border-primary/20'
                            : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${field.value === 'Private' ? 'bg-primary text-primary-foreground' : 'bg-surface-container text-muted-foreground'}`}>
                          <LockSimpleIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {DECK_COPY.privateVisibilityTitle}
                          </p>
                          {!isModal && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {DECK_COPY.privateVisibilityDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange('Public')}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        field.value === 'Public'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                          : isModal
                            ? 'border-transparent bg-surface-container-low hover:border-primary/20'
                            : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${field.value === 'Public' ? 'bg-primary text-primary-foreground' : 'bg-surface-container text-muted-foreground'}`}>
                          <GlobeHemisphereWestIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {DECK_COPY.publicVisibilityTitle}
                          </p>
                          {!isModal && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {DECK_COPY.publicVisibilityDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={isModal ? 'flex gap-3 pt-1' : 'flex flex-wrap justify-end gap-3'}>
            {onCancel && (
              <Button
                type="button"
                variant={isModal ? 'secondary' : 'outline'}
                onClick={onCancel}
                disabled={isSubmitting}
                className={isModal ? 'flex-1 rounded-xl py-2.5 text-sm font-semibold' : undefined}
              >
                {DECK_COPY.cancel}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={isModal ? 'flex-1 rounded-xl py-2.5 text-sm font-semibold' : undefined}
            >
              {isSubmitting && <SpinnerGapIcon size={16} className="animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
