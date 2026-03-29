import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { QuickDeckList } from '@/components/quick-study/QuickDeckList'
import { QuizTypePicker } from '@/components/quick-study/QuizTypePicker'
import { QUICK_STUDY_COPY } from '@/constants/quickStudy'
import { useQuickStudy } from '@/hooks/useQuickStudy'

export function QuickStudyPage() {
  const {
    selectedDeckId,
    quizType,
    starting,
    handleSelectDeck,
    handleSelectType,
    handleStart,
  } = useQuickStudy()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold text-foreground">{QUICK_STUDY_COPY.heading}</h1>
        <p className="text-sm text-muted-foreground">{QUICK_STUDY_COPY.subheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* ── Left: deck list ── */}
        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {QUICK_STUDY_COPY.deckSectionTitle}
          </p>
          <QuickDeckList
            selectedDeckId={selectedDeckId}
            onSelect={handleSelectDeck}
          />
        </section>

        {/* ── Right: type picker + start button ── */}
        <aside className="flex flex-col gap-6">
          <QuizTypePicker selected={quizType} onChange={handleSelectType} />

          <button
            onClick={handleStart}
            disabled={!selectedDeckId || starting}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-background transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            {starting ? QUICK_STUDY_COPY.startingBtn : QUICK_STUDY_COPY.startBtn}
          </button>

          {!selectedDeckId && (
            <p className="text-center text-xs text-muted-foreground">
              {QUICK_STUDY_COPY.selectHint}
            </p>
          )}
        </aside>
      </div>
    </DashboardLayout>
  )
}
