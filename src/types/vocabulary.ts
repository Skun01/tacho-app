// ─── Enums (mirror backend Domain.Enums) ───────────────────────────────────

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export type CardType = 'Vocab' | 'Grammar' | 'Kanji'

export type PublishStatus = 'Draft' | 'Published' | 'Archived'

export type WordType = 'Native' | 'SinoJapanese' | 'Loanword'

export type PartOfSpeech =
  | 'Noun'
  | 'VerbU'
  | 'VerbRu'
  | 'IAdj'
  | 'NaAdj'
  | 'Adverb'
  | 'Particle'
  | 'Conjunction'
  | 'Interjection'

// ─── Value Objects ──────────────────────────────────────────────────────────

export interface MeaningItem {
  partOfSpeech: PartOfSpeech
  definitions: string[]
}

export interface SentenceItem {
  id: string
  text: string
  meaning: string
  audioUrl?: string | null
  level?: JlptLevel | null
}

// ─── Card Summary (for search result list) ──────────────────────────────────

export interface VocabularyCardSummary {
  id: string
  cardType: CardType
  title: string
  summary: string
  level: JlptLevel | null
  tags: string[]
  status: PublishStatus
  createdAt: string

  // VocabularyDetail (flattened for list view)
  writing: string
  reading: string | null
  wordType: WordType | null
  meanings: MeaningItem[]
}

// ─── Card Detail (for detail page) ──────────────────────────────────────────

export interface VocabularyCardDetail {
  // Card base fields
  id: string
  cardType: CardType
  title: string
  summary: string
  level: JlptLevel | null
  tags: string[]
  status: PublishStatus
  createdAt: string
  updatedAt: string | null

  // VocabularyDetail
  writing: string
  reading: string | null
  pitchPattern: number[] | null
  audioUrl: string | null
  wordType: WordType | null
  meanings: MeaningItem[]
  synonyms: string[]
  antonyms: string[]
  relatedPhrases: string[]

  // Relations
  sentences: SentenceItem[]
  userNotes: UserCardNoteItem[]
}

// ─── User Card Note ─────────────────────────────────────────────────────────

export interface UserCardNoteItem {
  id: string
  userId: string
  userName: string
  content: string
  likesCount: number
  isLikedByMe: boolean
  createdAt: string
}

// ─── Search Params ──────────────────────────────────────────────────────────

export interface VocabularySearchParams {
  q: string
  level?: JlptLevel
  partOfSpeech?: PartOfSpeech
  page?: number
  pageSize?: number
}
