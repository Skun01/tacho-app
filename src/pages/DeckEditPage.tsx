import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftIcon, PlusIcon } from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { AddCardSearchPanel } from '@/components/library/AddCardSearchPanel'
import { DeckEmptyState } from '@/components/library/DeckEmptyState'
import { DeckFolderSection } from '@/components/library/DeckFolderSection'
import { DeckFormPanel } from '@/components/library/DeckFormPanel'
import { FolderFormPanel } from '@/components/library/FolderFormPanel'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import { DECK_COPY } from '@/constants/deck'
import {
  useAddCardToFolder,
  useCreateFolder,
  useDeckDetail,
  useDeckTypes,
  useDeleteDeck,
  useDeleteFolder,
  useRemoveCardFromFolder,
  useReorderFolderCards,
  useReorderFolders,
  useUpdateDeck,
  useUpdateFolder,
} from '@/hooks/useDecks'
import type { DeckFolderResponse } from '@/types/deck'

function buildFolderOrderPayload(
  folders: DeckFolderResponse[],
  folderId: string,
  direction: 'up' | 'down',
) {
  const sorted = [...folders].sort((left, right) => left.position - right.position)
  const index = sorted.findIndex((item) => item.id === folderId)
  const swapIndex = direction === 'up' ? index - 1 : index + 1

  if (index < 0 || swapIndex < 0 || swapIndex >= sorted.length) {
    return null
  }

  const next = [...sorted]
  ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]

  return {
    items: next.map((folder, order) => ({
      folderId: folder.id,
      position: (order + 1) * 1000,
    })),
  }
}

function buildCardOrderPayload(
  folder: DeckFolderResponse,
  cardId: string,
  direction: 'up' | 'down',
) {
  const sorted = [...folder.cards].sort((left, right) => left.position - right.position)
  const index = sorted.findIndex((item) => item.cardId === cardId)
  const swapIndex = direction === 'up' ? index - 1 : index + 1

  if (index < 0 || swapIndex < 0 || swapIndex >= sorted.length) {
    return null
  }

  const next = [...sorted]
  ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]

  return {
    items: next.map((item, order) => ({
      cardId: item.cardId,
      position: (order + 1) * 1000,
    })),
  }
}

export function DeckEditPage() {
  const navigate = useNavigate()
  const { deckId = '' } = useParams()
  const deckQuery = useDeckDetail(deckId, Boolean(deckId))
  const deckTypesQuery = useDeckTypes()
  const updateDeckMutation = useUpdateDeck(deckId)
  const deleteDeckMutation = useDeleteDeck()
  const createFolderMutation = useCreateFolder(deckId)
  const updateFolderMutation = useUpdateFolder(deckId)
  const deleteFolderMutation = useDeleteFolder(deckId)
  const addCardMutation = useAddCardToFolder(deckId)
  const removeCardMutation = useRemoveCardFromFolder(deckId)
  const reorderFoldersMutation = useReorderFolders(deckId)
  const reorderCardsMutation = useReorderFolderCards(deckId)
  const [showDeckForm, setShowDeckForm] = useState(false)
  const [showFolderForm, setShowFolderForm] = useState(false)
  const [editingFolder, setEditingFolder] = useState<DeckFolderResponse | null>(null)
  const [selectedAddCardFolderId, setSelectedAddCardFolderId] = useState<string | null>(null)

  useEffect(() => {
    if (deckQuery.isFetching || deckTypesQuery.isFetching) {
      NProgress.start()
      return
    }

    NProgress.done()
  }, [deckQuery.isFetching, deckTypesQuery.isFetching])

  const deck = deckQuery.data
  const sortedFolders = useMemo(
    () => deck?.folders.slice().sort((left, right) => left.position - right.position) ?? [],
    [deck],
  )

  if (deckQuery.isError || !deck) {
    return (
      <>
        <PageHelmet title={DECK_COPY.manage} description={DECK_COPY.detailDescription} />
        <AppLayout
          mainClassName="min-h-screen pt-24 pb-16"
          mainStyle={{ backgroundColor: 'var(--surface)' }}
        >
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <DeckEmptyState
              title={DECK_COPY.loadFailed}
              actionLabel={DECK_COPY.backToLibrary}
              onAction={() => navigate('/library')}
            />
          </div>
        </AppLayout>
      </>
    )
  }

  if (!deck.isOwner) {
    navigate(`/library/decks/${deck.id}`, { replace: true })
    return null
  }

  return (
    <>
      <PageHelmet
        title={`${deck.title} — ${DECK_COPY.manage}`}
        description={deck.description || DECK_COPY.detailDescription}
      />
      <AppLayout
        mainClassName="min-h-screen pt-24 pb-16"
        mainStyle={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              className="w-fit rounded-full"
              onClick={() => navigate(`/library/decks/${deck.id}`)}
            >
              <ArrowLeftIcon size={18} />
              {DECK_COPY.backToLibrary}
            </Button>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={() => setShowDeckForm((value) => !value)}>
                {showDeckForm ? DECK_COPY.cancel : DECK_COPY.editDeckTitle}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingFolder(null)
                  setShowFolderForm((value) => !value)
                }}
              >
                <PlusIcon size={16} />
                {DECK_COPY.createFolder}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (window.confirm(DECK_COPY.confirmDeleteDeck)) {
                    deleteDeckMutation.mutate(deck.id)
                  }
                }}
              >
                {DECK_COPY.deleteDeck}
              </Button>
            </div>
          </div>

          {showDeckForm && (
            <DeckFormPanel
              title={DECK_COPY.editDeckTitle}
              deckTypes={deckTypesQuery.data ?? []}
              initialValues={deck}
              submitLabel={DECK_COPY.saveSubmit}
              isPending={updateDeckMutation.isPending}
              onCancel={() => setShowDeckForm(false)}
              onSubmit={(values) =>
                updateDeckMutation.mutate(
                  {
                    title: values.title,
                    description: values.description || undefined,
                    coverImageUrl: values.coverImageUrl || null,
                    visibility: values.visibility,
                    typeId: values.typeId || null,
                  },
                  {
                    onSuccess: () => setShowDeckForm(false),
                  },
                )
              }
            />
          )}

          {showFolderForm && (
            <FolderFormPanel
              title={DECK_COPY.createFolder}
              isPending={createFolderMutation.isPending}
              onCancel={() => setShowFolderForm(false)}
              onSubmit={(values) =>
                createFolderMutation.mutate(
                  {
                    title: values.title,
                    description: values.description || undefined,
                  },
                  {
                    onSuccess: () => setShowFolderForm(false),
                  },
                )
              }
            />
          )}

          {editingFolder && (
            <FolderFormPanel
              title={DECK_COPY.editFolder}
              initialValues={editingFolder}
              isPending={updateFolderMutation.isPending}
              onCancel={() => setEditingFolder(null)}
              onSubmit={(values) =>
                updateFolderMutation.mutate(
                  {
                    folderId: editingFolder.id,
                    payload: {
                      title: values.title,
                      description: values.description || undefined,
                    },
                  },
                  {
                    onSuccess: () => setEditingFolder(null),
                  },
                )
              }
            />
          )}

          {selectedAddCardFolderId && (
            <AddCardSearchPanel
              isPending={addCardMutation.isPending}
              onClose={() => setSelectedAddCardFolderId(null)}
              onAddCard={(cardId) =>
                addCardMutation.mutate(
                  {
                    folderId: selectedAddCardFolderId,
                    payload: { cardId },
                  },
                  {
                    onSuccess: () => setSelectedAddCardFolderId(null),
                  },
                )
              }
            />
          )}

          <section className="space-y-4">
            {sortedFolders.length === 0 ? (
              <DeckEmptyState
                title={DECK_COPY.emptyFolders}
                actionLabel={DECK_COPY.createFolder}
                onAction={() => setShowFolderForm(true)}
              />
            ) : (
              sortedFolders.map((folder, index) => (
                <DeckFolderSection
                  key={folder.id}
                  folder={folder}
                  isOwner
                  isFirstFolder={index === 0}
                  isLastFolder={index === sortedFolders.length - 1}
                  onEdit={(folderId) => {
                    const selected = sortedFolders.find((item) => item.id === folderId) ?? null
                    setEditingFolder(selected)
                  }}
                  onDelete={(folderId) => {
                    if (window.confirm(`${DECK_COPY.deleteFolder}?`)) {
                      deleteFolderMutation.mutate(folderId)
                    }
                  }}
                  onAddCard={(folderId) => setSelectedAddCardFolderId(folderId)}
                  onRemoveCard={(folderId, cardId) =>
                    removeCardMutation.mutate({ folderId, cardId })
                  }
                  onMoveFolder={(folderId, direction) => {
                    const payload = buildFolderOrderPayload(sortedFolders, folderId, direction)
                    if (payload) {
                      reorderFoldersMutation.mutate(payload)
                    }
                  }}
                  onMoveCard={(folderId, cardId, direction) => {
                    const selectedFolder = sortedFolders.find((item) => item.id === folderId)
                    if (!selectedFolder) return
                    const payload = buildCardOrderPayload(selectedFolder, cardId, direction)
                    if (payload) {
                      reorderCardsMutation.mutate({
                        folderId,
                        payload,
                      })
                    }
                  }}
                />
              ))
            )}
          </section>
        </div>
      </AppLayout>
    </>
  )
}
