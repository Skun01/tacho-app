import { useState } from 'react'
import { SpeakerHighIcon } from '@phosphor-icons/react'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import { FuriganaText } from '@/components/ui/furigana-text'
import { CARD_DETAIL_COPY } from '@/constants/cardDetail'
import type { CardExample } from '@/types/card'

interface Props {
  example: CardExample
  showMeaning: boolean
}

export function ExampleCard({ example, showMeaning }: Props) {
  const [hovered, setHovered] = useState(false)
  const visible = showMeaning || hovered

  return (
    <div
      className="rounded-2xl bg-background p-4 shadow-[0_1px_8px_0_rgba(29,28,19,0.06)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <FuriganaText
          text={example.japaneseSentence}
          className="flex-1 font-kiwi text-base leading-relaxed text-foreground"
        />
        <div className="flex shrink-0 items-center gap-1.5">
          <JlptBadge level={example.jlptLevel} />
          <button
            disabled={!example.audioUrl}
            aria-label={CARD_DETAIL_COPY.audioAriaLabel}
            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              example.audioUrl
                ? 'bg-surface-container hover:bg-surface-container-highest'
                : 'cursor-not-allowed opacity-30'
            }`}
          >
            <SpeakerHighIcon size={12} className="text-secondary" />
          </button>
        </div>
      </div>

      <p
        className={`mt-2 text-sm text-secondary transition-all duration-200 ${
          visible ? '' : 'select-none blur-sm'
        }`}
      >
        {example.vietnameseMeaning}
      </p>
    </div>
  )
}
