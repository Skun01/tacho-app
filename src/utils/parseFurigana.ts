export type FuriganaSegment = { kanji: string; reading: string }
export type TextSegment = string | FuriganaSegment

export function isFurigana(seg: TextSegment): seg is FuriganaSegment {
  return typeof seg === 'object'
}

/**
 * Parse inline furigana markup: {漢字|かんじ}
 * Plain text with no markup is returned as a single string segment.
 */
export function parseFurigana(text: string): TextSegment[] {
  const FURIGANA_RE = /\{([^|{}]+)\|([^|{}]+)\}/g
  const segments: TextSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = FURIGANA_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.slice(lastIndex, match.index))
    }
    segments.push({ kanji: match[1], reading: match[2] })
    lastIndex = FURIGANA_RE.lastIndex
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex))
  }

  return segments.length > 0 ? segments : [text]
}
