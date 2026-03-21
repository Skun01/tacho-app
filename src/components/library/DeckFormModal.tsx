import { useRef, useState } from 'react'
import { XIcon, ImageIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { DECK_COPY, DECK_CATEGORIES, type DeckCategory } from '@/constants/deck'

interface DeckFormValues {
  name: string
  description: string
  category: DeckCategory
  coverPreview?: string
  coverFile?: File
}

interface DeckFormModalProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<DeckFormValues>
  onClose: () => void
  onSubmit: (values: DeckFormValues) => void
}

export function DeckFormModal({ mode, initialValues, onClose, onSubmit }: DeckFormModalProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [category, setCategory] = useState<DeckCategory>(initialValues?.category ?? 'Mặc định')
  const [coverPreview, setCoverPreview] = useState<string | undefined>(initialValues?.coverPreview)
  const [nameError, setNameError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const C = DECK_COPY.createModal

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return
    const url = URL.createObjectURL(file)
    setCoverPreview(url)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setNameError(C.nameRequired); return }
    setNameError('')
    onSubmit({ name: name.trim(), description: description.trim(), category, coverPreview })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1d1c13]/8 px-6 py-4">
          <h2 className="text-base font-bold text-foreground">
            {mode === 'create' ? C.titleCreate : C.titleEdit}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          >
            <XIcon size={16} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div
            className="group relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-surface-container-low transition-colors hover:bg-surface-container"
            onClick={() => fileRef.current?.click()}
          >
            {coverPreview ? (
              <>
                <img src={coverPreview} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <PencilSimpleIcon size={20} className="text-background" weight="bold" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <ImageIcon size={28} />
                <span className="text-xs">{C.coverBtn}</span>
                <span className="text-[10px] opacity-60">{C.coverHint}</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">{C.nameLabel}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError('') }}
              placeholder={C.namePlaceholder}
              className="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:bg-surface-container"
            />
            {nameError && <p className="text-xs text-rose-500">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">{C.descLabel}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={C.descPlaceholder}
              rows={3}
              className="resize-none rounded-xl bg-surface-container-low px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:bg-surface-container"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">{C.categoryLabel}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DeckCategory)}
              className="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-foreground outline-none focus:bg-surface-container"
            >
              {DECK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-surface-container py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
            >
              {C.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
            >
              {mode === 'create' ? C.createBtn : C.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
