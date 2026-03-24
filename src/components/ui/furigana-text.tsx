import { parseFurigana, isFurigana } from '@/utils/parseFurigana'

interface Props {
  text: string
  className?: string
}

export function FuriganaText({ text, className }: Props) {
  const segments = parseFurigana(text)

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        isFurigana(seg) ? (
          <ruby key={i}>
            {seg.kanji}
            <rt>{seg.reading}</rt>
          </ruby>
        ) : (
          <span key={i}>{seg}</span>
        ),
      )}
    </span>
  )
}
