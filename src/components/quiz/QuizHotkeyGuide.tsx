import { useState } from 'react'
import { QuestionIcon, XIcon } from '@phosphor-icons/react'

const SHORTCUTS = [
  { key: 'Enter', action: 'Submit / Tiếp theo câu' },
  { key: 'Backspace / Z', action: 'Hoàn tác đáp án' },
  { key: 'Space', action: 'Phát / Replay audio' },
  { key: '1 – 4', action: 'Chọn đáp án (trắc nghiệm)' },
  { key: 'S', action: 'Xem đáp án đúng (khi sai)' },
  { key: 'I', action: 'Xem thông tin thẻ' },
  { key: 'Escape', action: 'Thoát quiz' },
]

export function QuizHotkeyGuide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div className="fixed bottom-16 left-4 z-50 w-64 rounded-2xl border border-[#1d1c13]/10 bg-background shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1d1c13]/08 px-4 py-3">
            <span className="text-xs font-semibold text-foreground">Phím tắt</span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              <XIcon size={12} />
            </button>
          </div>
          <div className="px-4 py-3">
            {SHORTCUTS.map(({ key, action }) => (
              <div key={key} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-muted-foreground">{action}</span>
                <kbd className="ml-3 shrink-0 rounded-md border border-[#1d1c13]/12 bg-surface-container-low px-2 py-0.5 font-mono text-[10px] font-medium text-secondary">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Xem phím tắt"
        className={`fixed bottom-4 left-4 z-50 flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
          open
            ? 'border-primary/20 bg-primary/5 text-primary'
            : 'border-[#1d1c13]/12 bg-background text-muted-foreground hover:bg-surface-container hover:text-foreground'
        }`}
      >
        <QuestionIcon size={14} weight="bold" />
      </button>
    </>
  )
}
