import { SETTINGS_COPY } from '@/constants/settings'

const RS = SETTINGS_COPY.review

interface Props {
  localDaily: number
  localMax: number
  onChangeDaily: (v: number) => void
  onChangeMax: (v: number) => void
  onSave: () => void
  onClose: () => void
}

export function LearnSettingsModal({
  localDaily,
  localMax,
  onChangeDaily,
  onChangeMax,
  onSave,
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-[0_8px_40px_0_rgba(29,28,19,0.15)]">
        <h2 className="mb-5 text-base font-bold text-foreground">{RS.sectionTitle}</h2>

        <div className="flex flex-col gap-5">
          {/* Daily goal */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{RS.dailyNewLabel}</span>
              <span className="text-sm font-bold text-primary">{localDaily}</span>
            </div>
            <input
              type="range" min={5} max={50} step={5}
              value={localDaily}
              onChange={(e) => onChangeDaily(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground">{RS.dailyNewDesc}</p>
          </div>

          {/* Max per session */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{RS.maxSessionLabel}</span>
              <span className="text-sm font-bold text-primary">{localMax}</span>
            </div>
            <input
              type="range" min={5} max={50} step={5}
              value={localMax}
              onChange={(e) => onChangeMax(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground">{RS.maxSessionDesc}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-surface-container"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
          >
            {RS.saveBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
