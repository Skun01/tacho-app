import { SpeakerHighIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PART_OF_SPEECH_LABELS } from '@/constants/search'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'
import type { VocabularyCardDetail } from '@/types/vocabulary'

interface VocabDetailCardProps {
  card: VocabularyCardDetail
}

/**
 * "CHI TIẾT" card — contains NGHĨA TỪ ĐIỂN + CÁCH ĐỌC sections.
 * Matches the middle-left panel in the reference image.
 */
export function VocabDetailCard({ card }: VocabDetailCardProps) {
  return (
    <Card className="border-none py-0 section-card-surface section-card-elevation">
      <CardContent className="p-5 flex flex-col gap-5">
        {/* Section header */}
        <span className="text-xs font-bold tracking-wider text-muted-foreground">
          {VOCAB_DETAIL_COPY.detail.title}
        </span>

        {/* ── NGHĨA TỪ ĐIỂN ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
            {VOCAB_DETAIL_COPY.detail.dictMeaning}
          </span>

          {card.meanings.map((meaning, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <Badge variant="secondary" className="w-fit text-[10px]">
                {PART_OF_SPEECH_LABELS[meaning.partOfSpeech] ?? meaning.partOfSpeech}
              </Badge>
              <ol className="list-decimal list-inside flex flex-col gap-0.5">
                {meaning.definitions.map((def, i) => (
                  <li key={i} className="text-sm text-foreground">
                    {def}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <Separator />

        {/* ── CÁCH ĐỌC ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
            {VOCAB_DETAIL_COPY.detail.reading}
          </span>

          <div className="flex items-center justify-between">
            {/* Pitch accent visual display */}
            <PitchDisplay
              pattern={card.pitchPattern}
              reading={card.reading ?? card.writing}
            />

            {/* Audio button */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              disabled={!card.audioUrl}
              title={card.audioUrl ? VOCAB_DETAIL_COPY.audio.play : VOCAB_DETAIL_COPY.audio.unavailable}
            >
              <SpeakerHighIcon
                size={18}
                weight="fill"
                className={card.audioUrl ? 'text-primary' : 'text-muted-foreground opacity-40'}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Inline PitchDisplay ────────────────────────────────────────────────────

function PitchDisplay({
  pattern,
  reading,
}: {
  pattern?: number[] | null
  reading: string
}) {
  if (pattern && pattern.length > 0) {
    const morae = [...reading]
    return (
      <div className="flex items-end gap-0.5">
        {morae.map((mora, i) => (
          <span key={i} className="flex flex-col items-center">
            <span
              className={`mb-0.5 h-0.5 w-full rounded-full ${
                pattern[i] === 1 ? 'bg-primary' : 'bg-accent'
              }`}
            />
            <span className="font-heading-jp text-sm text-foreground">{mora}</span>
          </span>
        ))}
      </div>
    )
  }

  return <span className="font-heading-jp text-sm text-foreground">{reading}</span>
}
