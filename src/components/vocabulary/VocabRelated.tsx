  import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'

interface VocabRelatedProps {
  synonyms: string[]
  antonyms: string[]
  relatedPhrases: string[]
}

/**
 * TỪ LIÊN QUAN section — full width, wrapped in Card for visual distinction.
 */
export function VocabRelated({
  synonyms,
  antonyms,
  relatedPhrases,
}: VocabRelatedProps) {
  const hasAny = synonyms.length > 0 || antonyms.length > 0 || relatedPhrases.length > 0
  if (!hasAny) return null

  return (
    <section className="flex flex-col gap-4">
      <span className="text-xs font-bold tracking-wider text-muted-foreground">
        {VOCAB_DETAIL_COPY.related.title}
      </span>

      <Card className="border-none shadow-none py-0" style={{ backgroundColor: 'var(--surface-container-low)' }}>
        <CardContent className="p-5 flex flex-col gap-4">
          {synonyms.length > 0 && (
            <RelatedGroup label={VOCAB_DETAIL_COPY.related.synonyms} items={synonyms} />
          )}
          {antonyms.length > 0 && (
            <RelatedGroup label={VOCAB_DETAIL_COPY.related.antonyms} items={antonyms} />
          )}
          {relatedPhrases.length > 0 && (
            <RelatedGroup label={VOCAB_DETAIL_COPY.related.phrases} items={relatedPhrases} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function RelatedGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="outline" className="font-heading-jp text-sm cursor-default py-1 px-3">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}
