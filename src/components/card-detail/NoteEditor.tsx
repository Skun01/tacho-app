import { useEffect, useRef } from 'react'
import { CARD_DETAIL_COPY } from '@/constants/cardDetail'

interface Props {
  initialHtml?: string
  onSave: (html: string) => void
  onCancel: () => void
}

const FONT_SIZES = ['1', '2', '3', '4', '5', '6', '7']

function execCmd(cmd: string, value?: string) {
  document.execCommand(cmd, false, value)
}

export function NoteEditor({ initialHtml = '', onSave, onCancel }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fontSizeIndexRef = useRef(2) // default size index = '3' (normal)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml
      editorRef.current.focus()
    }
  }, [initialHtml])

  function handleSave() {
    onSave(editorRef.current?.innerHTML ?? '')
  }

  function handleBigger() {
    fontSizeIndexRef.current = Math.min(fontSizeIndexRef.current + 1, FONT_SIZES.length - 1)
    execCmd('fontSize', FONT_SIZES[fontSizeIndexRef.current])
  }

  function handleSmaller() {
    fontSizeIndexRef.current = Math.max(fontSizeIndexRef.current - 1, 0)
    execCmd('fontSize', FONT_SIZES[fontSizeIndexRef.current])
  }

  function handleLink() {
    const url = window.prompt('Nhập URL:')
    if (url) execCmd('createLink', url)
  }

  const toolBtn = 'flex h-7 min-w-[28px] items-center justify-center rounded-lg px-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-surface-container-highest hover:text-foreground'

  return (
    <div className="rounded-2xl border border-[#1d1c13]/10 bg-background shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#1d1c13]/08 px-3 py-2">
        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); execCmd('bold') }}>
          <strong>{CARD_DETAIL_COPY.noteToolBold}</strong>
        </button>
        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); execCmd('italic') }}>
          <em>{CARD_DETAIL_COPY.noteToolItalic}</em>
        </button>
        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); execCmd('underline') }}>
          <u>{CARD_DETAIL_COPY.noteToolUnderline}</u>
        </button>

        <span className="mx-1 h-4 w-px bg-surface-container-highest" />

        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); handleBigger() }}>
          {CARD_DETAIL_COPY.noteToolBigger}
        </button>
        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); handleSmaller() }}>
          {CARD_DETAIL_COPY.noteToolSmaller}
        </button>

        <span className="mx-1 h-4 w-px bg-surface-container-highest" />

        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList') }}>
          {CARD_DETAIL_COPY.noteToolBullet}
        </button>
        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList') }}>
          {CARD_DETAIL_COPY.noteToolNumbered}
        </button>

        <span className="mx-1 h-4 w-px bg-surface-container-highest" />

        <button className={toolBtn} onMouseDown={(e) => { e.preventDefault(); handleLink() }}>
          {CARD_DETAIL_COPY.noteToolLink}
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[120px] px-4 py-3 text-sm text-foreground outline-none [&_a]:text-primary [&_a]:underline [&_ol]:ml-4 [&_ol]:list-decimal [&_ul]:ml-4 [&_ul]:list-disc"
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#1d1c13]/08">
        <button
          onClick={onCancel}
          className="rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
        >
          {CARD_DETAIL_COPY.cancelNote}
        </button>
        <button
          onClick={handleSave}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
        >
          {CARD_DETAIL_COPY.saveNote}
        </button>
      </div>
    </div>
  )
}
