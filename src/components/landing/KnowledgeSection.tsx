import { SpeakerHigh } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LANDING_KNOWLEDGE } from '@/constants/landing'

export function KnowledgeSection() {
  return (
    <section
      id={LANDING_KNOWLEDGE.anchor}
      className="bg-surface-container-low py-24 px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Section header ─────────────────────────────── */}
        <div className="mb-16 flex flex-col items-start gap-3">
          <h2
            className="text-4xl md:text-5xl font-extrabold text-on-surface"
            style={{ letterSpacing: '0.01em' }}
          >
            {LANDING_KNOWLEDGE.heading}
          </h2>
          <p className="text-secondary max-w-xl">
            Ba trụ cột giúp bạn học tiếng Nhật một cách có hệ thống và thực tế.
          </p>
        </div>

        {/* ── Card grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LANDING_KNOWLEDGE.cards.map((card) => (
            <KnowledgeCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Card sub-component ──────────────────────────────────────────────────────

type Card = typeof LANDING_KNOWLEDGE.cards[number]

function KnowledgeCard({ card }: { card: Card }) {
  return (
    <Card className="group flex flex-col gap-0 bg-surface-container-lowest border-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(29,28,19,0.07)]">
      <CardHeader className="pb-0">
        {/* Kanji icon */}
        <div className="mb-4 self-start flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container-highest text-primary">
          <span className="font-['Kiwi_Maru'] text-2xl font-medium select-none">
            {card.kanji}
          </span>
        </div>
        <CardTitle className="text-xl font-bold text-on-surface">
          {card.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-3">
        <p className="text-secondary text-sm leading-relaxed">
          {card.description}
        </p>

        {/* Preview */}
        <CardPreview card={card} />
      </CardContent>
    </Card>
  )
}

// ─── Preview variants ────────────────────────────────────────────────────────

function CardPreview({ card }: { card: Card }) {
  if (card.previewType === 'chips' && 'chips' in card) {
    return (
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        {card.chips.map((chip) => (
          <Badge key={chip} variant="secondary" className="rounded-full">
            {chip}
          </Badge>
        ))}
      </div>
    )
  }

  if (card.previewType === 'example' && 'exampleJP' in card) {
    return (
      <div className="pt-2 border-t border-border">
        <div className="flex items-start gap-2 rounded-xl bg-surface-container-highest p-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 mt-0.5 text-primary hover:text-primary hover:bg-transparent"
            aria-label="Phát âm thanh"
          >
            <SpeakerHigh size={16} weight="fill" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <span className="font-['Kiwi_Maru'] text-sm text-on-surface leading-snug">
              {card.exampleJP}
            </span>
            <span className="text-xs text-secondary leading-snug">
              {card.exampleVI}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}
