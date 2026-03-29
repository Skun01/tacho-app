
import { VocabDetailView } from '@/components/card-detail/VocabDetailView'
import { GrammarDetailView } from '@/components/card-detail/GrammarDetailView'
import { StudyLoadingSkeleton } from '@/components/study/StudyLoadingSkeleton'
import { StudyTopBar } from '@/components/study/StudyTopBar'
import { StudyBottomNav } from '@/components/study/StudyBottomNav'
import { useStudySession } from '@/hooks/useStudySession'
import { CARD_TYPE } from '@/types/card'
import { STUDY_COPY } from '@/constants/study'

export function StudyPage() {
  const session = useStudySession()
  const { index, batchIds, loading, visible, total, isFirst, isLast, current, progress, routeMode, prev, next } = session

  return (
    <div className="min-h-screen bg-surface-container-low">
      <StudyTopBar loading={loading} index={index} total={total} />

      <main className="mx-auto max-w-4xl px-4 pb-32 pt-20">
        {loading ? (
          <StudyLoadingSkeleton />
        ) : current ? (
          <div
            key={index}
            className={`transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}
          >
            {current.type === CARD_TYPE.VOCAB
              ? <VocabDetailView card={current} />
              : <GrammarDetailView card={current} />
            }
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <p className="text-sm">{STUDY_COPY.notFound}</p>
          </div>
        )}
      </main>

      <StudyBottomNav
        loading={loading}
        index={index}
        total={total}
        isFirst={isFirst}
        isLast={isLast}
        progress={progress}
        batchIds={batchIds}
        routeMode={routeMode}
        prev={prev}
        next={next}
      />
    </div>
  )
}
