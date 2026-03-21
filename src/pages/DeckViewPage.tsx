import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  ArrowsClockwiseIcon,
  BookmarkSimpleIcon,
  BookmarkIcon,
  CopyIcon,
  PencilSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DECK_COPY, MOCK_DECK_EDIT, MOCK_DECK_VIEW, type EditableDeck } from '@/constants/deck'
import { CardRow } from '@/components/library/CardRow'

const C = DECK_COPY.viewPage
const PER_PAGE = C.perPage

const MOCK_DECK_LOOKUP: Record<string, EditableDeck> = {
  me1: MOCK_DECK_EDIT,
  mv1: MOCK_DECK_VIEW,
}

export function DeckViewPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const deck = (id && MOCK_DECK_LOOKUP[id]) ?? MOCK_DECK_VIEW
  const [inReview, setInReview] = useState(deck.isInReview)
  const [saved, setSaved] = useState(deck.isSaved)
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(deck.cards.length / PER_PAGE))
  const pageCards = deck.cards.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const vocabCount = deck.cards.filter((c) => c.type === 'vocab').length
  const grammarCount = deck.cards.filter((c) => c.type === 'grammar').length

  function handleClone() {
    navigate(`/deck/me1/edit`)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-background p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-foreground">{deck.name}</h1>
            {deck.description && (
              <p className="text-sm text-muted-foreground">{deck.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{C.creatorLabel}: </span>
              {deck.creator}
            </span>
            <span>
              <span className="font-semibold text-foreground">{C.totalCardsLabel}: </span>
              {deck.cards.length}
            </span>
            {vocabCount > 0 && (
              <span>
                <span className="font-semibold text-foreground">{vocabCount}</span> {C.vocabLabel}
              </span>
            )}
            {grammarCount > 0 && (
              <span>
                <span className="font-semibold text-foreground">{grammarCount}</span> {C.grammarLabel}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInReview((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                inReview
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'bg-primary text-background hover:bg-primary-container'
              }`}
            >
              <ArrowsClockwiseIcon size={14} />
              {inReview ? C.removeFromReviewBtn : C.addToReviewBtn}
            </button>

            <button
              onClick={() => setSaved((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                saved
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-surface-container text-muted-foreground hover:bg-surface-container-highest'
              }`}
            >
              {saved ? (
                <BookmarkSimpleIcon size={14} weight="fill" />
              ) : (
                <BookmarkIcon size={14} />
              )}
              {saved ? C.savedBtn : C.saveBtn}
            </button>

            <button
              onClick={handleClone}
              className="flex items-center gap-1.5 rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
            >
              <CopyIcon size={14} />
              {C.cloneBtn}
            </button>

            {deck.isOwner && (
              <button
                onClick={() => navigate(`/deck/${deck.id}/edit`)}
                className="flex items-center gap-1.5 rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-container-highest"
              >
                <PencilSimpleIcon size={14} />
                {C.editBtn}
              </button>
            )}
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {pageCards.map((card) => (
            <CardRow key={card.id} card={card} />
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm transition-colors hover:bg-surface-container disabled:opacity-30"
            >
              <CaretLeftIcon size={14} />
            </button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm transition-colors hover:bg-surface-container disabled:opacity-30"
            >
              <CaretRightIcon size={14} />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
