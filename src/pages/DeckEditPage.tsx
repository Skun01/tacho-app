import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  PencilSimpleIcon,
  PlusIcon,
  DownloadSimpleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DeckFormModal } from '@/components/library/DeckFormModal'
import { AddCardModal } from '@/components/library/AddCardModal'
import { ConfirmDeleteModal } from '@/components/library/ConfirmDeleteModal'
import { CardRow } from '@/components/library/CardRow'
import { DECK_COPY } from '@/constants/deck'
import { CARD_TYPE } from '@/types/card'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { deleteDeck, updateDeck, addCardsToDeck, removeCardFromDeck } from '@/services/deckService'
import { useDeckEdit } from '@/hooks/useDeckEdit'
import { useDeckDragDrop } from '@/hooks/useDeckDragDrop'
import { filterCards, countByType } from '@/utils/cardUtils'

const C = DECK_COPY.editPage

export function DeckEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { deck, cards, setCards, refreshDeck } = useDeckEdit(id)
  const [search, setSearch] = useState('')
  const [showEditInfo, setShowEditInfo] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const { dragOver, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDeckDragDrop({
    deckId: id,
    cards,
    setCards,
    onReorderComplete: refreshDeck,
  })

  const visibleCards = filterCards(cards, search)
  const vocabCount   = countByType(cards, CARD_TYPE.VOCAB)
  const grammarCount = countByType(cards, CARD_TYPE.GRAMMAR)
  const existingIds  = new Set(cards.map((c) => c.id))

  async function handleConfirmDelete() {
    if (!id) return
    await deleteDeck(id)
    navigate('/library')
  }

  if (!deck) return (
    <DashboardLayout>
      <div className="py-16 text-center text-sm text-muted-foreground">{C.loading}</div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-background p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground truncate">{deck.name}</h1>
                <button
                  onClick={() => setShowEditInfo(true)}
                  aria-label={C.editInfoTooltip}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
                >
                  <PencilSimpleIcon size={14} className="text-muted-foreground" />
                </button>
              </div>
              {deck.description && (
                <p className="mt-1 text-sm text-muted-foreground">{deck.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{C.typeLabel}: </span>
              {deck.category}
            </span>
            <span>
              <span className="font-semibold text-foreground">{C.creatorLabel}: </span>
              {deck.ownerName}
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
            <span className="ml-auto text-[10px] opacity-60">{C.maxCardsHint}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddCard(true)}
              disabled={cards.length >= 1000}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-container disabled:opacity-40"
            >
              <PlusIcon size={14} weight="bold" />
              {C.addCardBtn}
            </button>

            <button
              disabled
              title={C.importDisabledHint}
              className="flex items-center gap-1.5 rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <DownloadSimpleIcon size={14} />
              {C.importBtn}
            </button>

            <button
              onClick={() => setShowConfirmDelete(true)}
              className="ml-auto flex items-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
            >
              <TrashIcon size={14} />
              {C.deleteBtn}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2.5 shadow-[0_1px_8px_0_rgba(29,28,19,0.08)]">
          <MagnifyingGlassIcon size={14} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={C.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        {cards.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">{C.emptyList}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {visibleCards.map((card) => {
              const originalIdx = cards.indexOf(card)
              return (
                <CardRow
                  key={card.id}
                  card={card}
                  draggable
                  isDragOver={dragOver === originalIdx}
                  onDragStart={() => handleDragStart(originalIdx)}
                  onDragOver={(e) => handleDragOver(e, originalIdx)}
                  onDrop={() => handleDrop(originalIdx)}
                  onDragEnd={handleDragEnd}
                  onRemove={() => setCards((prev) => prev.filter((c) => c.id !== card.id))}
                />
              )
            })}
          </ul>
        )}
      </div>

      {showConfirmDelete && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
        />
      )}

      {showEditInfo && (
        <DeckFormModal
          mode="edit"
          initialValues={{ name: deck.name, description: deck.description, category: deck.category }}
          onClose={() => setShowEditInfo(false)}
          onSubmit={async ({ name, description, category, coverPreview }) => {
            if (!id) return
            await updateDeck(id, { name, description, category, coverUrl: coverPreview })
            await refreshDeck()
            setShowEditInfo(false)
            gooeyToast.success(C.savedToast)
          }}
        />
      )}

      {showAddCard && (
        <AddCardModal
          existingIds={existingIds}
          onAdd={async (card) => {
            if (!id || cards.length >= 1000) return
            await addCardsToDeck(id, [card.id])
            await refreshDeck()
          }}
          onRemove={async (cardId) => {
            if (!id) return
            await removeCardFromDeck(id, cardId)
            await refreshDeck()
          }}
          onClose={() => setShowAddCard(false)}
        />
      )}
    </DashboardLayout>
  )
}
