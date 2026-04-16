import type { PaginatedMeta } from '@/types/api'
import type { SearchCardSummary } from '@/types/search'

export type DeckVisibility = 'Public' | 'Private'
export type DeckStatus = 'Draft' | 'Published' | 'Archived'

export interface DeckTypeResponse {
  id: string
  name: string
}

export interface DeckTypeInfo {
  id: string | null
  name: string | null
}

export interface DeckOwnerInfo {
  id: string
  username: string
  avatarUrl: string | null
}

export interface DeckFolderCardItemResponse {
  cardId: string
  position: number
  addedAt: string
  card: SearchCardSummary
}

export interface DeckFolderResponse {
  id: string
  title: string
  description: string
  position: number
  cardsCount: number
  cards: DeckFolderCardItemResponse[]
}

export interface DeckListItemResponse {
  id: string
  title: string
  description: string
  coverImageUrl: string | null
  visibility: DeckVisibility
  status: DeckStatus
  isOfficial: boolean
  cardsCount: number
  foldersCount: number
  type: DeckTypeInfo
  createdBy: DeckOwnerInfo
  forkedFromId: string | null
  isBookmarked: boolean
  isOwner: boolean
  createdAt: string
  updatedAt: string
}

export interface DeckDetailResponse extends DeckListItemResponse {
  folders: DeckFolderResponse[]
}

export interface BookmarkDeckResponse {
  deckId: string
  bookmarked: boolean
  savedAt: string | null
}

export interface DeckListParams {
  q?: string
  typeId?: string
  officialOnly?: boolean
  page?: number
  pageSize?: number
}

export interface MyDeckListParams {
  q?: string
  typeId?: string
  page?: number
  pageSize?: number
}

export interface CreateDeckPayload {
  title: string
  description?: string
  coverImageUrl?: string | null
  visibility?: DeckVisibility
  typeId?: string | null
}

export interface UpdateDeckPayload {
  title?: string
  description?: string
  coverImageUrl?: string | null
  visibility?: DeckVisibility
  typeId?: string | null
}

export interface UploadImageResponse {
  id: string
  fileUrl: string
  fileType: 'Image'
  usageType: 'Image'
  sizeInBytes: number
  createdAt: string
}

export interface CreateFolderPayload {
  title: string
  description?: string
  position?: number
}

export interface UpdateFolderPayload {
  title?: string
  description?: string
}

export interface AddCardToFolderPayload {
  cardId: string
  position?: number
}

export interface ReorderFoldersPayload {
  items: Array<{
    folderId: string
    position: number
  }>
}

export interface ReorderFolderCardsPayload {
  items: Array<{
    cardId: string
    position: number
  }>
}

export interface DeckListResult {
  items: DeckListItemResponse[]
  meta: PaginatedMeta | null
}
