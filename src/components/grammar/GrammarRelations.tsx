import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { ArrowSquareOutIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GRAMMAR_DETAIL_COPY } from '@/constants/grammarDetail'
import { grammarService } from '@/services/grammarService'
import type { GrammarCardDetail, GrammarRelationItem } from '@/types/grammar'

interface GrammarRelationsProps {
  relations: GrammarRelationItem[]
}

export function GrammarRelations({ relations }: GrammarRelationsProps) {
  const relatedIds = useMemo(
    () => [...new Set(relations.map((relation) => relation.relatedId))],
    [relations],
  )

  const relatedQueries = useQueries({
    queries: relatedIds.map((relatedId) => ({
      queryKey: ['grammar', 'relation-detail', relatedId] as const,
      queryFn: async () => {
        try {
          const response = await grammarService.getDetail(relatedId)
          if (response.success) return response.data
          return null
        } catch {
          return null
        }
      },
      staleTime: 1000 * 60 * 5,
    })),
  })

  const relatedById = useMemo(() => {
    const map = new Map<string, GrammarCardDetail>()
    relatedQueries.forEach((query, index) => {
      if (query.data) {
        map.set(relatedIds[index], query.data)
      }
    })
    return map
  }, [relatedIds, relatedQueries])

  return (
    <section className="flex flex-col gap-4">
      <span className="section-title-text">{GRAMMAR_DETAIL_COPY.sections.related}</span>

      {relations.length === 0 ? (
        <Card className="border-none py-0 section-card-surface section-card-elevation">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{GRAMMAR_DETAIL_COPY.empty.noRelations}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {relations.map((relation) => {
            const relatedCard = relatedById.get(relation.relatedId)
            const fallbackTitle = `${GRAMMAR_DETAIL_COPY.related.fallbackTitle} ${relation.relatedId}`

            return (
              <a
                key={`${relation.relatedId}-${relation.relationType}`}
                href={`/grammar/${relation.relatedId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="border-none py-0 section-card-surface section-card-elevation hover:section-card-elevation-hover transition-all duration-300">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {relatedCard?.title ?? fallbackTitle}
                      </p>
                      {relatedCard?.summary && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {relatedCard.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline">
                        {GRAMMAR_DETAIL_COPY.relationType[relation.relationType]}
                      </Badge>
                      <span className="sr-only">{GRAMMAR_DETAIL_COPY.related.openNewTabLabel}</span>
                      <ArrowSquareOutIcon size={14} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
