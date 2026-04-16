import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { DECK_COPY } from '@/constants/deck'
import { DECK_ERROR_MESSAGES } from '@/constants/errors'
import { getApiErrorMessage } from '@/lib/apiError'
import { deckService } from '@/services/deckService'
import type {
  AddCardToFolderPayload,
  CreateDeckPayload,
  CreateFolderPayload,
  DeckListParams,
  MyDeckListParams,
  ReorderFolderCardsPayload,
  ReorderFoldersPayload,
  UpdateDeckPayload,
  UpdateFolderPayload,
} from '@/types/deck'

export const DECK_QUERY_KEYS = {
  all: ['decks'] as const,
  types: ['decks', 'types'] as const,
  publicList: (params: DeckListParams) => ['decks', 'public', params] as const,
  bookmarkedList: (params: MyDeckListParams) => ['decks', 'bookmarked', params] as const,
  myList: (params: MyDeckListParams) => ['decks', 'mine', params] as const,
  detail: (deckId: string) => ['decks', 'detail', deckId] as const,
}

function invalidateAllDeckLists(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.all }),
    queryClient.invalidateQueries({ queryKey: ['cards', 'search'] }),
  ])
}

export function useDeckTypes() {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.types,
    queryFn: () => deckService.getDeckTypes(),
  })
}

export function usePublicDecks(params: DeckListParams) {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.publicList(params),
    queryFn: () => deckService.getPublicDecks(params),
  })
}

export function useBookmarkedDecks(params: MyDeckListParams, enabled = true) {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.bookmarkedList(params),
    queryFn: () => deckService.getBookmarkedDecks(params),
    enabled,
  })
}

export function useMyDecks(params: MyDeckListParams, enabled = true) {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.myList(params),
    queryFn: () => deckService.getMyDecks(params),
    enabled,
  })
}

export function useDeckDetail(deckId: string, enabled = true) {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.detail(deckId),
    queryFn: () => deckService.getDeckDetail(deckId),
    enabled: enabled && Boolean(deckId),
  })
}

export function useToggleDeckBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ deckId, bookmarked }: { deckId: string; bookmarked: boolean }) =>
      deckService.toggleBookmark(deckId, bookmarked),
    onMutate: async ({ deckId, bookmarked }) => {
      await queryClient.cancelQueries({ queryKey: DECK_QUERY_KEYS.all })

      const previousEntries = queryClient.getQueriesData({ queryKey: DECK_QUERY_KEYS.all })

      previousEntries.forEach(([queryKey, value]) => {
        if (Array.isArray(queryKey) && value && typeof value === 'object') {
          const typedValue = value as {
            items?: Array<{ id: string; isBookmarked: boolean }>
            isBookmarked?: boolean
          }

          if (Array.isArray(typedValue.items)) {
            queryClient.setQueryData(queryKey, {
              ...typedValue,
              items: typedValue.items.map((item) =>
                item.id === deckId ? { ...item, isBookmarked: bookmarked } : item,
              ),
            })
          }

          if ('isBookmarked' in typedValue) {
            queryClient.setQueryData(queryKey, {
              ...typedValue,
              isBookmarked: bookmarked,
            })
          }
        }
      })

      return { previousEntries }
    },
    onError: (error, _variables, context) => {
      context?.previousEntries?.forEach(([queryKey, value]) => {
        queryClient.setQueryData(queryKey, value)
      })
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
    onSuccess: () => {
      gooeyToast.success(DECK_COPY.bookmarkSaved)
    },
    onSettled: async () => {
      await invalidateAllDeckLists(queryClient)
    },
  })
}

export function useForkDeck() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deckId: string) => deckService.forkDeck(deckId),
    onSuccess: async (deck) => {
      queryClient.setQueryData(DECK_QUERY_KEYS.detail(deck.id), deck)
      await invalidateAllDeckLists(queryClient)
      gooeyToast.success(DECK_COPY.forkSuccess)
      navigate(`/library/my-decks/${deck.id}/edit`)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useCreateDeck() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: CreateDeckPayload) => deckService.createDeck(payload),
    onSuccess: async (deck) => {
      queryClient.setQueryData(DECK_QUERY_KEYS.detail(deck.id), deck)
      await invalidateAllDeckLists(queryClient)
      gooeyToast.success(DECK_COPY.deckCreated)
      navigate(`/library/my-decks/${deck.id}/edit`)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useUpdateDeck(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateDeckPayload) => deckService.updateDeck(deckId, payload),
    onSuccess: async (deck) => {
      queryClient.setQueryData(DECK_QUERY_KEYS.detail(deckId), deck)
      await invalidateAllDeckLists(queryClient)
      gooeyToast.success(DECK_COPY.deckSaved)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useDeleteDeck() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (deckId: string) => deckService.deleteDeck(deckId),
    onSuccess: async () => {
      await invalidateAllDeckLists(queryClient)
      gooeyToast.success(DECK_COPY.deckDeleted)
      navigate('/library')
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useCreateFolder(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFolderPayload) => deckService.createFolder(deckId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) })
      gooeyToast.success(DECK_COPY.folderSaved)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useUpdateFolder(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      folderId: string
      payload: UpdateFolderPayload
    }) => deckService.updateFolder(folderId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) })
      gooeyToast.success(DECK_COPY.folderSaved)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useDeleteFolder(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderId: string) => deckService.deleteFolder(folderId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) })
      gooeyToast.success(DECK_COPY.folderDeleted)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useAddCardToFolder(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      folderId: string
      payload: AddCardToFolderPayload
    }) => deckService.addCardToFolder(folderId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) })
      gooeyToast.success(DECK_COPY.cardAdded)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useRemoveCardFromFolder(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      folderId,
      cardId,
    }: {
      folderId: string
      cardId: string
    }) => deckService.removeCardFromFolder(folderId, cardId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) })
      gooeyToast.success(DECK_COPY.cardRemoved)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useReorderFolders(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReorderFoldersPayload) => deckService.reorderFolders(deckId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) })
      gooeyToast.success(DECK_COPY.orderSaved)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}

export function useReorderFolderCards(deckId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      folderId: string
      payload: ReorderFolderCardsPayload
    }) => deckService.reorderFolderCards(folderId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) })
      gooeyToast.success(DECK_COPY.orderSaved)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, DECK_ERROR_MESSAGES.default))
    },
  })
}
