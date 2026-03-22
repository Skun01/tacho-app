export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
export type CardType = 'vocab' | 'grammar'

export interface VocabCard {
  id: string
  type: 'vocab'
  jlptLevel: JlptLevel
  content: string
  reading: string
  meaning: string
  exampleSentence?: string
  exampleMeaning?: string
}

export interface GrammarCard {
  id: string
  type: 'grammar'
  jlptLevel: JlptLevel
  content: string
  meaning: string
  example?: string
  notes?: string
}

export type FlashCard = VocabCard | GrammarCard

export interface CardProgress {
  cardId: string
  masteryLevel: number     // 0 = new, 1–4 = learning, 5 = pro
  isInReview: boolean      // card is in the user's active review queue
  isSaved: boolean         // card is bookmarked by the user
  nextReviewAt?: string    // ISO 8601
  lastReviewedAt?: string
}

// FlashCard + user-specific progress (returned for authenticated endpoints)
export type FlashCardWithProgress = FlashCard & { progress?: CardProgress }

// ─── Card Detail types ───────────────────────────────────────────────────────

export interface DictEntry {
  partOfSpeech: string
  definitions: string[]
}

export interface CardExample {
  id: string
  japaneseSentence: string
  vietnameseMeaning: string
  jlptLevel: JlptLevel
  audioUrl?: string
}

export interface LinkedCard {
  id: string
  content: string
  meaning: string
}

export interface ReferenceLink {
  id: string
  title: string
  url: string
}

export type GrammarRegister = 'casual' | 'standard' | 'polite' | 'formal'

export interface CardProgressDetail {
  masteryStage: number      // 0–14 across 15 stages
  firstLearnedAt: string    // ISO 8601
  lastReviewedAt: string
  nextReviewAt: string
  reviewCount: number
}

export interface VocabCardDetail extends VocabCard {
  pitchAccent?: string      // e.g. "わ↘たし"
  pitchPattern?: number[]   // per mora: 0=low 1=high
  audioUrl?: string
  dictionaryEntries: DictEntry[]
  examples: CardExample[]
  userNote?: string
  userProgress?: CardProgressDetail
}

export interface GrammarCardDetail extends GrammarCard {
  structure: string
  formalVariant?: string
  register: GrammarRegister
  aboutText: string
  antonyms: LinkedCard[]
  relatedStructures: LinkedCard[]
  references: ReferenceLink[]
  examples: CardExample[]
  aboutExamples?: CardExample[]   // examples shown inline within the about section
  userNote?: string
  userProgress?: CardProgressDetail
}

export type CardDetail = VocabCardDetail | GrammarCardDetail
