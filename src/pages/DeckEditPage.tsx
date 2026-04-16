import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  PencilSimpleIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import NProgress from 'nprogress'
import { useNavigate, useParams } from 'react-router'
import { AddCardSearchPanel } from '@/components/library/AddCardSearchPanel'
import { DeckCardSearchBar } from '@/components/library/DeckCardSearchBar'
import { ConfirmActionDialog } from '@/components/library/ConfirmActionDialog'
import { DeckEmptyState } from '@/components/library/DeckEmptyState'
import { DeckFolderSection } from '@/components/library/DeckFolderSection'
import { DeckFormPanel } from '@/components/library/DeckFormPanel'
import { FolderFormPanel } from '@/components/library/FolderFormPanel'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHelmet } from '@/components/seo/PageHelmet'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
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
import { deckService } from '@/services/deckService'
import type { DeckFolderResponse } from '@/types/deck'

function moveItemById<T extends { id: string }>(items: T[], activeId: string, overId: string) {
  const currentIndex = items.findIndex((item) => item.id === activeId)
  const targetIndex = items.findIndex((item) => item.id === overId)

  if (currentIndex < 0 || targetIndex < 0 || currentIndex === targetIndex) {
    return null
  }

  const next = [...items]
  const [moved] = next.splice(currentIndex, 1)
  next.splice(targetIndex, 0, moved)

  return next
}

function buildFolderOrderPayload(
  folders: DeckFolderResponse[],
  activeFolderId: string,
  overFolderId: string,
) {
  const sorted = [...folders].sort((left, right) => left.position - right.position)
  const next = moveItemById(sorted, activeFolderId, overFolderId)

  if (!next) {
    return null
  }

  return {
    items: next.map((folder, order) => ({
      folderId: folder.id,
      position: (order + 1) * 1000,
    })),
  }
}

function buildCardOrderPayload(
  folder: DeckFolderResponse,
  activeCardId: string,
  overCardId: string,
) {
  const sorted = [...folder.cards].sort((left, right) => left.position - right.position)
  const next = moveItemById(
    sorted.map((item) => ({ ...item, id: item.cardId })),
    activeCardId,
    overCardId,
  )

  if (!next) {
    return null
  }

  return {
    items: next.map((item, order) => ({
      cardId: item.id,
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
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteDeckConfirm, setShowDeleteDeckConfirm] = useState(false)
  const [folderPendingDelete, setFolderPendingDelete] = useState<DeckFolderResponse | null>(null)
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null)
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null)
  const [draggedCardState, setDraggedCardState] = useState<{
    folderId: string
    cardId: string
  } | null>(null)
  const [dragOverCardState, setDragOverCardState] = useState<{
    folderId: string
    cardId: string
  } | null>(null)

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
  const totalCards = useMemo(
    () => sortedFolders.reduce((count, folder) => count + folder.cards.length, 0),
    [sortedFolders],
  )
  const existingCardFolderMap = useMemo(
    () =>
      sortedFolders.reduce<Record<string, string>>((result, folder) => {
        folder.cards.forEach((item) => {
          result[item.cardId] = folder.id
        })
        return result
      }, {}),
    [sortedFolders],
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
          </div>

          <section className="flex flex-col gap-4 rounded-3xl bg-background p-6 shadow-[0_2px_12px_0_rgba(29,28,19,0.07)]">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-xl font-bold text-foreground">{deck.title}</h1>
                  <button
                    type="button"
                    onClick={() => setShowDeckForm(true)}
                    aria-label={DECK_COPY.editInfoTooltip}
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
                <span className="font-semibold text-foreground">{DECK_COPY.typeMetaLabel}: </span>
                {deck.type.name ?? DECK_COPY.deckTypeEmpty}
              </span>
              <span>
                <span className="font-semibold text-foreground">{DECK_COPY.creatorMetaLabel}: </span>
                {deck.createdBy.username}
              </span>
              <span>
                <span className="font-semibold text-foreground">{DECK_COPY.cardsLabel}: </span>
                {deck.cardsCount}
              </span>
              <span className="ml-auto text-[10px] opacity-60">{DECK_COPY.maxCardsHint}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-semibold"
                onClick={() => {
                  setEditingFolder(null)
                  setShowFolderForm(true)
                }}
              >
                <PlusIcon size={14} />
                {DECK_COPY.createFolder}
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled
                title={DECK_COPY.importDisabledHint}
                className="rounded-xl px-4 py-2 text-sm font-semibold"
              >
                <DownloadSimpleIcon size={14} />
                {DECK_COPY.importDeck}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="ml-auto rounded-xl border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                onClick={() => setShowDeleteDeckConfirm(true)}
              >
                {DECK_COPY.deleteDeck}
              </Button>
            </div>
          </section>

          {totalCards > 0 && (
            <DeckCardSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={DECK_COPY.searchDeckCardsPlaceholder}
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
              sortedFolders.map((folder) => (
                <DeckFolderSection
                  key={folder.id}
                  folder={folder}
                  isOwner
                  searchQuery={searchQuery}
                  draggable={!searchQuery.trim()}
                  isDragOver={dragOverFolderId === folder.id && draggedFolderId !== folder.id}
                  onDragStart={() => setDraggedFolderId(folder.id)}
                  onDragOver={(event) => {
                    if (searchQuery.trim()) return
                    event.preventDefault()
                    setDragOverFolderId(folder.id)
                  }}
                  onDrop={() => {
                    if (!draggedFolderId || draggedFolderId === folder.id) {
                      setDragOverFolderId(null)
                      return
                    }

                    const payload = buildFolderOrderPayload(sortedFolders, draggedFolderId, folder.id)
                    if (payload) {
                      reorderFoldersMutation.mutate(payload)
                    }

                    setDraggedFolderId(null)
                    setDragOverFolderId(null)
                  }}
                  onDragEnd={() => {
                    setDraggedFolderId(null)
                    setDragOverFolderId(null)
                  }}
                  onEdit={(folderId) => {
                    const selected = sortedFolders.find((item) => item.id === folderId) ?? null
                    setEditingFolder(selected)
                  }}
                  onDelete={(folderId) => {
                    const selected = sortedFolders.find((item) => item.id === folderId) ?? null
                    setFolderPendingDelete(selected)
                  }}
                  onAddCard={(folderId) => setSelectedAddCardFolderId(folderId)}
                  onRemoveCard={(folderId, cardId) =>
                    removeCardMutation.mutate({ folderId, cardId })
                  }
                  onDragCardStart={(cardId) => {
                    if (searchQuery.trim()) return
                    setDraggedCardState({ folderId: folder.id, cardId })
                  }}
                  onDragCardOver={(cardId) => {
                    if (searchQuery.trim()) return
                    setDragOverCardState({ folderId: folder.id, cardId })
                  }}
                  onDropCard={(cardId) => {
                    if (
                      !draggedCardState ||
                      draggedCardState.folderId !== folder.id ||
                      draggedCardState.cardId === cardId
                    ) {
                      setDragOverCardState(null)
                      return
                    }

                    const payload = buildCardOrderPayload(folder, draggedCardState.cardId, cardId)
                    if (payload) {
                      reorderCardsMutation.mutate({
                        folderId: folder.id,
                        payload,
                      })
                    }

                    setDraggedCardState(null)
                    setDragOverCardState(null)
                  }}
                  onDragCardEnd={() => {
                    setDraggedCardState(null)
                    setDragOverCardState(null)
                  }}
                  draggedCardId={
                    draggedCardState?.folderId === folder.id ? draggedCardState.cardId : null
                  }
                  dragOverCardId={
                    dragOverCardState?.folderId === folder.id ? dragOverCardState.cardId : null
                  }
                />
              ))
            )}
          </section>
        </div>
      </AppLayout>

      <Dialog open={showDeckForm} onOpenChange={setShowDeckForm}>
        <DialogContent className="max-w-md overflow-hidden p-0">
          <DeckFormPanel
            variant="modal"
            title={DECK_COPY.editDeckTitle}
            deckTypes={deckTypesQuery.data ?? []}
            initialValues={deck}
            submitLabel={DECK_COPY.saveSubmit}
            isPending={updateDeckMutation.isPending}
            onCancel={() => setShowDeckForm(false)}
            onSubmit={async (values) => {
              const uploadedImage = values.coverImageFile
                ? await deckService.uploadDeckImage(values.coverImageFile)
                : null

              await updateDeckMutation.mutateAsync({
                title: values.title,
                description: values.description || undefined,
                coverImageUrl: uploadedImage?.fileUrl ?? deck.coverImageUrl ?? null,
                visibility: values.visibility,
                typeId: values.typeId || null,
              })
              setShowDeckForm(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showFolderForm} onOpenChange={setShowFolderForm}>
        <DialogContent className="max-w-md overflow-hidden p-0">
          <FolderFormPanel
            variant="modal"
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
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingFolder)} onOpenChange={(open) => !open && setEditingFolder(null)}>
        <DialogContent className="max-w-md overflow-hidden p-0">
          {editingFolder && (
            <FolderFormPanel
              variant="modal"
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
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedAddCardFolderId)}
        onOpenChange={(open) => !open && setSelectedAddCardFolderId(null)}
      >
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          {selectedAddCardFolderId && (
            <AddCardSearchPanel
              variant="modal"
              isPending={addCardMutation.isPending}
              existingCardFolderMap={existingCardFolderMap}
              onClose={() => setSelectedAddCardFolderId(null)}
              onAddCard={(cardId) =>
                addCardMutation.mutate(
                  {
                    folderId: selectedAddCardFolderId,
                    payload: { cardId },
                  },
                )
              }
              onRemoveCard={(cardId, folderId) =>
                removeCardMutation.mutate({ folderId, cardId })
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={showDeleteDeckConfirm}
        title={DECK_COPY.confirmDeleteDeckTitle}
        description={DECK_COPY.confirmDeleteDeckMessage}
        isPending={deleteDeckMutation.isPending}
        onOpenChange={setShowDeleteDeckConfirm}
        onConfirm={() => deleteDeckMutation.mutate(deck.id)}
      />

      <ConfirmActionDialog
        open={Boolean(folderPendingDelete)}
        title={DECK_COPY.confirmDeleteFolderTitle}
        description={DECK_COPY.confirmDeleteFolderMessage}
        isPending={deleteFolderMutation.isPending}
        onOpenChange={(open) => !open && setFolderPendingDelete(null)}
        onConfirm={() => {
          if (!folderPendingDelete) return
          deleteFolderMutation.mutate(folderPendingDelete.id, {
            onSuccess: () => setFolderPendingDelete(null),
          })
        }}
      />
    </>
  )
}
