import { useState } from 'react'
import { SpeakerHighIcon, PlusCircleIcon, BookmarkSimpleIcon, StackIcon, EyeIcon, EyeClosedIcon } from '@phosphor-icons/react'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import { FuriganaText } from '@/components/ui/furigana-text'
import { ExampleCard } from './ExampleCard'
import { NoteEditor } from './NoteEditor'
import { ProgressCard } from './ProgressCard'
import { AddToDeckModal } from '@/components/search/AddToDeckModal'
import { CARD_DETAIL_COPY } from '@/constants/cardDetail'
import type { VocabCardDetail, CardProgressDetail } from '@/types/card'

interface Props {
  card: VocabCardDetail
}

export function VocabDetailView({ card: initial }: Props) {
  const [card, setCard] = useState(initial)
  const [editingNote, setEditingNote] = useState(false)
  const [showDeckModal, setShowDeckModal] = useState(false)
  const [showMeanings, setShowMeanings] = useState(false)

  const hasProgress = !!card.userProgress

  function patchProgress(patch: Partial<CardProgressDetail>) {
    if (!card.userProgress) return
    setCard((c) => ({ ...c, userProgress: { ...c.userProgress!, ...patch } }))
  }

  function handleAddToReview() {
    setCard((c) => ({
      ...c,
      userProgress: {
        masteryStage: 0,
        firstLearnedAt: new Date().toISOString(),
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        reviewCount: 0,
      },
    }))
  }

  function handleMarkMastered() {
    const now = new Date().toISOString()
    setCard((c) => ({
      ...c,
      userProgress: {
        masteryStage: 14,
        firstLearnedAt: c.userProgress?.firstLearnedAt ?? now,
        lastReviewedAt: now,
        nextReviewAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        reviewCount: (c.userProgress?.reviewCount ?? 0) + 1,
      },
    }))
  }

  function handleResetProgress() {
    setCard((c) => ({ ...c, userProgress: undefined }))
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

      {/* ── LEFT COLUMN (2/3): Overview + Details ── */}
      <div className="order-2 flex flex-col gap-4 lg:order-none lg:col-span-2">

        {/* Hero overview */}
        <div className="rounded-3xl bg-background p-6 shadow-[0_2px_16px_0_rgba(29,28,19,0.07)]">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <JlptBadge level={card.jlptLevel} />
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              Từ vựng
            </span>
          </div>
          <FuriganaText text={card.content} className="font-kiwi text-5xl font-medium tracking-wide text-foreground" />
          <p className="mt-3 text-base font-semibold text-foreground">{card.meaning}</p>
        </div>

        {/* Details: Dictionary + pitch */}
        <div className="rounded-2xl bg-background p-5 shadow-[0_1px_8px_0_rgba(29,28,19,0.06)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {CARD_DETAIL_COPY.sectionDetails}
          </p>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
            {CARD_DETAIL_COPY.dictLabel}
          </p>
          <ol className="flex flex-col gap-3">
            {card.dictionaryEntries.map((entry, ei) => (
              <li key={ei}>
                <span className="mb-1 inline-block rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-medium text-secondary">
                  {entry.partOfSpeech}
                </span>
                <ol className="flex flex-col gap-0.5">
                  {entry.definitions.map((def, di) => (
                    <li key={di} className="flex gap-2 text-sm text-foreground">
                      <span className="shrink-0 font-semibold text-muted-foreground/50">{di + 1}.</span>
                      <span>{def}</span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>

          {card.pitchAccent && (
            <div className="mt-4 flex items-center gap-4 border-t border-[#1d1c13]/06 pt-4">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {CARD_DETAIL_COPY.pitchLabel}
                </p>
                <PitchDisplay accent={card.pitchAccent} pattern={card.pitchPattern} reading={card.reading} />
              </div>
              <button
                disabled={!card.audioUrl}
                aria-label={CARD_DETAIL_COPY.audioAriaLabel}
                className={`ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                  card.audioUrl
                    ? 'bg-surface-container hover:bg-surface-container-highest'
                    : 'cursor-not-allowed opacity-30'
                }`}
              >
                <SpeakerHighIcon size={18} className="text-secondary" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN (1/3): Actions first on mobile ── */}
      <div className="order-1 flex flex-col gap-3 lg:order-none lg:col-span-1">
        {hasProgress ? (
          <ProgressCard
            progress={card.userProgress!}
            onUpdateStage={(s) => patchProgress({ masteryStage: s })}
            onReset={handleResetProgress}
            onRemove={handleResetProgress}
            onMarkMastered={handleMarkMastered}
          />
        ) : (
          <div className="flex flex-col gap-2 rounded-2xl bg-background p-4 shadow-[0_1px_8px_0_rgba(29,28,19,0.06)]">
            <button
              onClick={handleAddToReview}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-container"
            >
              <PlusCircleIcon size={15} />
              {CARD_DETAIL_COPY.addToReview}
            </button>
            <button
              onClick={handleMarkMastered}
              className="flex items-center justify-center gap-2 rounded-xl bg-surface-container px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-container-highest"
            >
              <BookmarkSimpleIcon size={15} />
              {CARD_DETAIL_COPY.markMastered}
            </button>
          </div>
        )}

        {/* Note */}
        {editingNote ? (
          <NoteEditor
            initialHtml={card.userNote}
            onSave={(html) => { setCard((c) => ({ ...c, userNote: html })); setEditingNote(false) }}
            onCancel={() => setEditingNote(false)}
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            {card.userNote && (
              <div
                className="rounded-2xl bg-surface-container-low px-4 py-3 text-sm text-foreground [&_a]:text-primary [&_a]:underline [&_ol]:ml-4 [&_ol]:list-decimal [&_ul]:ml-4 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: card.userNote }}
              />
            )}
            <button
              onClick={() => setEditingNote(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#1d1c13]/10 px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
            >
              <PlusCircleIcon size={14} />
              {card.userNote ? CARD_DETAIL_COPY.editNote : CARD_DETAIL_COPY.addNote}
            </button>
          </div>
        )}

        <button
          onClick={() => setShowDeckModal(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#1d1c13]/10 px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container"
        >
          <StackIcon size={14} />
          {CARD_DETAIL_COPY.addToDeck}
        </button>
      </div>

      {/* ── EXAMPLES: Full width ── */}
      {card.examples.length > 0 && (
        <section className="order-3 lg:order-none lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {CARD_DETAIL_COPY.sectionExamples}
            </h2>
            <button
              onClick={() => setShowMeanings((v) => !v)}
              className="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-secondary transition-colors hover:bg-surface-container-highest"
            >
              {showMeanings
                ? <><EyeClosedIcon size={11} /> {CARD_DETAIL_COPY.hideTranslation}</>
                : <><EyeIcon size={11} /> {CARD_DETAIL_COPY.showTranslation}</>
              }
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {card.examples.map((ex) => (
              <ExampleCard key={ex.id} example={ex} showMeaning={showMeanings} />
            ))}
          </div>
        </section>
      )}

      {showDeckModal && (
        <AddToDeckModal
          cardCount={1}
          onClose={() => setShowDeckModal(false)}
          onConfirm={() => setShowDeckModal(false)}
        />
      )}
    </div>
  )
}

function PitchDisplay({
  accent, pattern, reading,
}: { accent?: string; pattern?: number[]; reading: string }) {
  if (pattern && pattern.length > 0) {
    const morae = [...reading]
    return (
      <div className="flex items-end gap-0.5">
        {morae.map((mora, i) => (
          <span key={i} className="flex flex-col items-center">
            <span
              className={`mb-0.5 h-0.5 w-full rounded-full ${
                pattern[i] === 1 ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            />
            <span className="font-kiwi text-sm text-foreground">{mora}</span>
          </span>
        ))}
      </div>
    )
  }
  return <span className="font-kiwi text-sm text-foreground">{accent ?? reading}</span>
}
