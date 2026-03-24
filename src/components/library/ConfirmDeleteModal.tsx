import { WarningCircleIcon } from '@phosphor-icons/react'
import { DECK_COPY } from '@/constants/deck'

const C = DECK_COPY.editPage

interface Props {
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDeleteModal({ onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-background p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <WarningCircleIcon size={24} className="text-rose-500" weight="fill" />
        </div>
        <h3 className="mb-2 text-base font-bold text-foreground">{C.confirmDeleteTitle}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{C.confirmDeleteMsg}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-surface-container py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
          >
            {C.cancelBtn}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
          >
            {C.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
