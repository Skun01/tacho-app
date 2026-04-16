import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  AddCardToFolderPayload,
  BookmarkDeckResponse,
  CreateDeckPayload,
  CreateFolderPayload,
  DeckDetailResponse,
  DeckFolderCardItemResponse,
  DeckFolderResponse,
  DeckListParams,
  DeckListResult,
  DeckListItemResponse,
  DeckTypeResponse,
  MyDeckListParams,
  ReorderFolderCardsPayload,
  ReorderFoldersPayload,
  UploadImageResponse,
  UpdateDeckPayload,
  UpdateFolderPayload,
} from '@/types/deck'
import api from './api'

function mapDeckListResponse(
  response: PaginatedResponse<DeckListItemResponse>,
): DeckListResult {
  return {
    items: response.data ?? [],
    meta: response.metaData ?? null,
  }
}

export const deckService = {
  async getDeckTypes(): Promise<DeckTypeResponse[]> {
    const response = await api.get<ApiResponse<DeckTypeResponse[]>>('/deck-types')
    return response.data.data ?? []
  },

  async getPublicDecks(params: DeckListParams): Promise<DeckListResult> {
    const response = await api.get<PaginatedResponse<DeckListItemResponse>>('/decks', {
      params,
    })
    return mapDeckListResponse(response.data)
  },

  async getBookmarkedDecks(params: MyDeckListParams): Promise<DeckListResult> {
    const response = await api.get<PaginatedResponse<DeckListItemResponse>>(
      '/me/decks/bookmarks',
      { params },
    )
    return mapDeckListResponse(response.data)
  },

  async getMyDecks(params: MyDeckListParams): Promise<DeckListResult> {
    const response = await api.get<PaginatedResponse<DeckListItemResponse>>('/me/decks', {
      params,
    })
    return mapDeckListResponse(response.data)
  },

  async getDeckDetail(deckId: string): Promise<DeckDetailResponse> {
    const response = await api.get<ApiResponse<DeckDetailResponse>>(`/decks/${deckId}`)
    if (!response.data.data) {
      throw new Error('Deck_NotFound_404')
    }
    return response.data.data
  },

  async toggleBookmark(deckId: string, bookmarked: boolean): Promise<BookmarkDeckResponse> {
    const response = await api.post<ApiResponse<BookmarkDeckResponse>>(
      `/decks/${deckId}/bookmark`,
      { bookmarked },
    )
    if (!response.data.data) {
      throw new Error('Deck_Forbidden_403')
    }
    return response.data.data
  },

  async forkDeck(deckId: string): Promise<DeckDetailResponse> {
    const response = await api.post<ApiResponse<DeckDetailResponse>>(`/decks/${deckId}/fork`)
    if (!response.data.data) {
      throw new Error('Deck_ForkSourceInvalid_400')
    }
    return response.data.data
  },

  async createDeck(payload: CreateDeckPayload): Promise<DeckDetailResponse> {
    const response = await api.post<ApiResponse<DeckDetailResponse>>('/me/decks', payload)
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async updateDeck(deckId: string, payload: UpdateDeckPayload): Promise<DeckDetailResponse> {
    const response = await api.patch<ApiResponse<DeckDetailResponse>>(`/me/decks/${deckId}`, payload)
    if (!response.data.data) {
      throw new Error('Deck_NotFound_404')
    }
    return response.data.data
  },

  async deleteDeck(deckId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/me/decks/${deckId}`)
    return response.data.data === true
  },

  async createFolder(deckId: string, payload: CreateFolderPayload): Promise<DeckFolderResponse> {
    const response = await api.post<ApiResponse<DeckFolderResponse>>(
      `/me/decks/${deckId}/folders`,
      payload,
    )
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },

  async reorderFolders(
    deckId: string,
    payload: ReorderFoldersPayload,
  ): Promise<DeckFolderResponse[]> {
    const response = await api.put<ApiResponse<DeckFolderResponse[]>>(
      `/me/decks/${deckId}/folders/order`,
      payload,
    )
    return response.data.data ?? []
  },

  async updateFolder(
    folderId: string,
    payload: UpdateFolderPayload,
  ): Promise<DeckFolderResponse> {
    const response = await api.patch<ApiResponse<DeckFolderResponse>>(
      `/me/folders/${folderId}`,
      payload,
    )
    if (!response.data.data) {
      throw new Error('Deck_FolderNotFound_404')
    }
    return response.data.data
  },

  async deleteFolder(folderId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/me/folders/${folderId}`)
    return response.data.data === true
  },

  async addCardToFolder(
    folderId: string,
    payload: AddCardToFolderPayload,
  ): Promise<DeckFolderResponse> {
    const response = await api.post<ApiResponse<DeckFolderResponse>>(
      `/me/folders/${folderId}/cards`,
      payload,
    )
    if (!response.data.data) {
      throw new Error('Deck_CardNotFound_404')
    }
    return response.data.data
  },

  async removeCardFromFolder(folderId: string, cardId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(`/me/folders/${folderId}/cards/${cardId}`)
    return response.data.data === true
  },

  async reorderFolderCards(
    folderId: string,
    payload: ReorderFolderCardsPayload,
  ): Promise<DeckFolderCardItemResponse[]> {
    const response = await api.put<ApiResponse<DeckFolderCardItemResponse[]>>(
      `/me/folders/${folderId}/cards/order`,
      payload,
    )
    return response.data.data ?? []
  },

  async uploadDeckImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post<ApiResponse<UploadImageResponse>>('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (!response.data.data) {
      throw new Error('Validation_400')
    }

    return response.data.data
  },
}
