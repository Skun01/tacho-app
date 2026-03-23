import { useState } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { authService } from '@/services/authService'
import { gooeyToast } from 'goey-toast'
import { SETTINGS_COPY } from '@/constants/settings'

const C = SETTINGS_COPY.password

interface Props {
  onClose: () => void
}

export function ChangePasswordModal({ onClose }: Props) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (next !== confirm) {
      setError(C.mismatchError)
      return
    }
    setLoading(true)
    try {
      await authService.changePassword(current, next)
      gooeyToast.success(C.successToast)
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg === 'WRONG_CURRENT_PASSWORD' ? C.wrongCurrentError : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-[0_8px_40px_0_rgba(29,28,19,0.15)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{C.modalTitle}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-container"
          >
            <XIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: C.currentLabel, value: current, onChange: setCurrent },
            { label: C.newLabel,     value: next,    onChange: setNext },
            { label: C.confirmLabel, value: confirm, onChange: setConfirm },
          ].map(({ label, value, onChange }) => (
            <label key={label} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">{label}</span>
              <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-foreground outline-none ring-1 ring-transparent transition focus:ring-primary"
              />
            </label>
          ))}

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-2 text-xs text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              {error}
            </p>
          )}

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
            >
              {C.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container disabled:opacity-50"
            >
              {loading ? '...' : C.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
