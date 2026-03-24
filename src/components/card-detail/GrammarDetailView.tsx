import { useState } from 'react'
import { InfoIcon, PlusCircleIcon, BookmarkSimpleIcon, StackIcon, LinkIcon, ArrowRightIcon, EyeIcon, EyeClosedIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import { JlptBadge } from '@/components/ui/jlpt-badge'
import { FuriganaText } from '@/components/ui/furigana-text'
import { ExampleCard } from './ExampleCard'
import { NoteEditor } from './NoteEditor'
import { ProgressCard } from './ProgressCard'
import { AddToDeckModal } from '@/components/search/AddToDeckModal'
import { CARD_DETAIL_COPY } from '@/constants/cardDetail'
import type { GrammarCardDetail, CardProgressDetail, GrammarRegister } from '@/types/card'

interface Props {
  card: GrammarCardDetail
}

const REGISTER_COLORS: Record<GrammarRegister, string> = {
  casual:   'bg-orange-100 text-orange-700',
  standard: 'bg-blue-100 text-blue-700',
  polite:   'bg-violet-100 text-violet-700',
  formal:   'bg-primary/10 text-primary',
}

export function GrammarDetailView({ card: initial }: Props) {
  const navigate = useNavigate()
  const [card, setCard] = useState(initial)
  const [showPolite, setShowPolite] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(false)
  const [showDeckModal, setShowDeckModal] = useState(false)
  const [showMeanings, setShowMeanings] = useState(false)

  const hasProgress = !!card.userProgress
  const displayStructure = showPolite && card.formalVariant ? card.formalVariant : card.structure
  const registerInfo = CARD_DETAIL_COPY.registers[card.register]

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

      {/* ── LEFT COLUMN (2/3): Structure + About + Antonyms/Related ── */}
      <div className="order-2 flex flex-col gap-4 lg:order-none lg:col-span-2">

        {/* Hero: structure overview */}
        <div className="rounded-3xl bg-background p-6 shadow-[0_2px_16px_0_rgba(29,28,19,0.07)]">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <JlptBadge level={card.jlptLevel} />
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              Ngữ pháp
            </span>
          </div>
          <FuriganaText text={card.content} className="font-kiwi text-4xl font-medium tracking-wide text-foreground" />
          <p className="mt-2 text-base font-semibold text-foreground">{card.meaning}</p>

          {/* Structure + polite toggle */}
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {CARD_DETAIL_COPY.structureLabel}
              </span>
              {card.formalVariant && (
                <div className="flex rounded-full bg-surface-container p-0.5">
                  <button
                    onClick={() => setShowPolite(false)}
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold transition-colors ${
                      !showPolite ? 'bg-background text-primary shadow-sm' : 'text-secondary'
                    }`}
                  >
                    {CARD_DETAIL_COPY.toggleCasual}
                  </button>
                  <button
                    onClick={() => setShowPolite(true)}
                    className={`rounded-full px-3 py-0.5 text-xs font-semibold transition-colors ${
                      showPolite ? 'bg-background text-primary shadow-sm' : 'text-secondary'
                    }`}
                  >
                    {CARD_DETAIL_COPY.togglePolite}
                  </button>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-surface-container-low px-4 py-3 font-kiwi text-sm text-foreground">
              <FuriganaText text={displayStructure} />
            </div>
          </div>

          {/* Register */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{CARD_DETAIL_COPY.registerLabel}:</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${REGISTER_COLORS[card.register]}`}>
              {registerInfo.label}
            </span>
            <button
              onClick={() => setRegisterModalOpen(true)}
              aria-label={CARD_DETAIL_COPY.registerInfoTitle}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-container text-muted-foreground transition-colors hover:bg-surface-container-highest"
            >
              <InfoIcon size={11} />
            </button>
          </div>
        </div>

        {/* About text + inline examples */}
        <div className="rounded-2xl bg-background p-5 shadow-[0_1px_8px_0_rgba(29,28,19,0.06)]">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {CARD_DETAIL_COPY.aboutLabel} {card.content}
          </h2>
          <div
            className="text-sm leading-relaxed text-foreground [&_em]:italic [&_p+p]:mt-2 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: card.aboutText }}
          />
          {card.aboutExamples && card.aboutExamples.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 border-t border-[#1d1c13]/06 pt-4">
              {card.aboutExamples.map((ex) => (
                <ExampleCard key={ex.id} example={ex} showMeaning={showMeanings} />
              ))}
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

        {/* Antonyms + Related stacked below actions */}
        {card.antonyms.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {CARD_DETAIL_COPY.antonymsLabel}
            </p>
            <div className="flex flex-col gap-1.5">
              {card.antonyms.map((a) => (
                <LinkedCardItem key={a.id} item={a} onClick={() => navigate(`/card/${a.id}`)} />
              ))}
            </div>
          </div>
        )}
        {card.relatedStructures.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {CARD_DETAIL_COPY.relatedLabel}
            </p>
            <div className="flex flex-col gap-1.5">
              {card.relatedStructures.map((r) => (
                <LinkedCardItem key={r.id} item={r} onClick={() => navigate(`/card/${r.id}`)} />
              ))}
            </div>
          </div>
        )}
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

      {/* ── References: Full width ── */}
      {card.references.length > 0 && (
        <section className="order-4 lg:order-none lg:col-span-3">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {CARD_DETAIL_COPY.referencesLabel}
          </h2>
          <div className="flex flex-col gap-1.5">
            {card.references.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm text-primary shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] transition-colors hover:bg-surface-container-low"
              >
                <LinkIcon size={13} className="shrink-0" />
                {ref.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Register info modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setRegisterModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-background p-6 shadow-2xl">
            <h3 className="mb-4 text-base font-bold text-foreground">
              {CARD_DETAIL_COPY.registerInfoTitle}
            </h3>
            <div className="flex flex-col gap-3">
              {(Object.entries(CARD_DETAIL_COPY.registers) as [GrammarRegister, { label: string; desc: string }][]).map(
                ([key, info]) => (
                  <div key={key} className="flex gap-3">
                    <span className={`mt-0.5 h-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${REGISTER_COLORS[key]}`}>
                      {info.label}
                    </span>
                    <p className="text-sm text-secondary">{info.desc}</p>
                  </div>
                ),
              )}
            </div>
            <button
              onClick={() => setRegisterModalOpen(false)}
              className="mt-5 w-full rounded-xl bg-surface-container py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
            >
              {CARD_DETAIL_COPY.registerClose}
            </button>
          </div>
        </div>
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

function LinkedCardItem({ item, onClick }: { item: { content: string; meaning: string }; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3 text-left shadow-[0_1px_6px_0_rgba(29,28,19,0.06)] transition-colors hover:bg-surface-container-low"
    >
      <ArrowRightIcon size={13} className="shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <FuriganaText text={item.content} className="font-kiwi text-sm font-medium text-foreground" />
        <p className="truncate text-xs text-muted-foreground">{item.meaning}</p>
      </div>
    </button>
  )
}
