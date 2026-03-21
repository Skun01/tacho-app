import type { FlashCard } from './card'

// Runtime array — also the source-of-truth for the DeckCategory union type
export const DECK_CATEGORY_OPTIONS = [
  'Mặc định', 'Từ vựng', 'Ngữ pháp', 'Anime', 'Manga',
  'Âm nhạc', 'TV', 'Novel', 'Game', 'Sách giáo khoa', 'Khác',
] as const

export type DeckCategory = (typeof DECK_CATEGORY_OPTIONS)[number]

export type DeckSource = 'user' | 'app' | 'community' | 'textbook'

// ── Core deck entity (matches API list response) ─────────────────────────────

export interface Deck {
  id: string
  name: string
  description: string
  category: DeckCategory
  source: DeckSource
  coverIndex: number        // 0–5 preset gradient; falls back when no coverUrl
  coverUrl?: string         // custom image URL (future upload)
  ownerId: string
  ownerName: string
  isPublic: boolean
  totalCards: number
  vocabCount: number
  grammarCount: number
  userCount: number         // total learners
  textbook?: string         // only when source === 'textbook'
  createdAt: string         // ISO 8601
  updatedAt: string
}

// ── User-specific overlay — merged in when authenticated ─────────────────────

export interface DeckUserState {
  isOwner: boolean
  isBookmarked: boolean
  isSaved: boolean          // deck added to personal library
  isInReview: boolean       // deck active in SRS queue
  learnedCards: number
  reviewDue: number
}

// ── Composite types for UI ───────────────────────────────────────────────────

export type DeckListItem = Deck & DeckUserState

export interface DeckDetail extends Deck {
  cards: FlashCard[]
}

export type DeckDetailWithState = DeckDetail & DeckUserState

// ── Request payload types (for future API write operations) ──────────────────

export interface CreateDeckPayload {
  name: string
  description: string
  category: DeckCategory
  isPublic: boolean
  coverUrl?: string
}

export type UpdateDeckPayload = Partial<CreateDeckPayload>

export interface AddCardsToDeckPayload {
  cardIds: string[]
}

export interface ReorderCardsPayload {
  orderedCardIds: string[]
}

// ── Service query params ─────────────────────────────────────────────────────

export interface ListDecksParams {
  source?: DeckSource
  category?: DeckCategory
  isOwner?: boolean
  isInReview?: boolean
  isSaved?: boolean
  textbook?: string
  search?: string
}
