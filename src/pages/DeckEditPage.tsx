import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@phosphor-icons/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DeckEditHeader } from '@/components/library/DeckEditHeader'
import { DeckPageSkeleton } from '@/components/library/DeckPageSkeleton'
import { DeckFormModal } from '@/components/library/DeckFormModal'
import { AddCardModal } from '@/components/library/AddCardModal'
import { ConfirmDeleteModal } from '@/components/library/ConfirmDeleteModal'
import { CardRow } from '@/components/library/CardRow'
import { DECK_COPY } from '@/constants/deck'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { deleteDeck, updateDeck, addCardsToDeck, removeCardFromDeck, uploadDeckCover } from '@/services/deckService'
import { useDeckEdit } from '@/hooks/useDeckEdit'
import { useDeckDragDrop } from '@/hooks/useDeckDragDrop'
import { filterCards } from '@/utils/cardUtils'

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
  const existingIds  = new Set(cards.map((c) => c.id))

  async function handleConfirmDelete() {
    if (!id) return
    await deleteDeck(id)
    navigate('/library')
  }

  if (!deck) return (
    <DashboardLayout>
      <DeckPageSkeleton />
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/library')}
          className="flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-surface-container hover:text-foreground"
        >
          <ArrowLeftIcon size={14} />
          {C.backBtn}
        </button>

        <DeckEditHeader
          deck={deck}
          cards={cards}
          onEditInfo={() => setShowEditInfo(true)}
          onAddCard={() => setShowAddCard(true)}
          onDelete={() => setShowConfirmDelete(true)}
        />

        {/* Search bar */}
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

        {/* Card list */}
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
          initialValues={{ name: deck.name, description: deck.description, category: deck.category, coverPreview: deck.coverUrl }}
          onClose={() => setShowEditInfo(false)}
          onSubmit={async ({ name, description, category, coverPreview, coverFile }) => {
            if (!id) return
            const uploadedCoverUrl = coverFile ? await uploadDeckCover(coverFile) : coverPreview
            await updateDeck(id, { name, description, category, coverUrl: uploadedCoverUrl })
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
