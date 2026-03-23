import { useEffect, useState } from 'react'
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
import { DECK_COPY } from '@/constants/deck'
import type { DeckDetailWithState } from '@/types/deck'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { cloneDeck, getDeckDetail, toggleInReview, toggleSaved } from '@/services/deckService'
import { CardRow } from '@/components/library/CardRow'

const C = DECK_COPY.viewPage
const PER_PAGE = C.perPage

export function DeckViewPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [deck, setDeck] = useState<DeckDetailWithState | null>(null)
  const [inReview, setInReview] = useState(false)
  const [saved, setSaved] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (id) {
      getDeckDetail(id).then((d) => {
        setDeck(d)
        setInReview(d.isInReview)
        setSaved(d.isSaved)
      })
    }
  }, [id])

  if (!deck) return (
    <DashboardLayout>
      <div className="py-16 text-center text-sm text-muted-foreground">{DECK_COPY.editPage.loading}</div>
    </DashboardLayout>
  )

  const totalPages = Math.max(1, Math.ceil(deck.cards.length / PER_PAGE))
  const pageCards = deck.cards.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const vocabCount = deck.cards.filter((c) => c.type === 'vocab').length
  const grammarCount = deck.cards.filter((c) => c.type === 'grammar').length

  async function handleClone() {
    if (!deck) return
    const cloned = await cloneDeck(deck.id)
    gooeyToast.success(C.clonedToast)
    navigate(`/deck/${cloned.id}/edit`)
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
              {deck.ownerName}
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
              onClick={async () => {
                const next = !inReview
                await toggleInReview(deck.id, next)
                setInReview(next)
                setDeck((prev) => prev ? { ...prev, isInReview: next } : prev)
              }}
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
              onClick={async () => {
                const next = !saved
                await toggleSaved(deck.id, next)
                setSaved(next)
                setDeck((prev) => prev ? { ...prev, isSaved: next } : prev)
                if (next) gooeyToast.success(C.savedToast)
              }}
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
