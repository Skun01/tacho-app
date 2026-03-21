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
  masteryLevel: number     // 0 = unseen, 1–4 = learning, 5 = mastered
  nextReviewAt?: string    // ISO 8601
  lastReviewedAt?: string
}

// FlashCard + user-specific progress (returned for authenticated endpoints)
export type FlashCardWithProgress = FlashCard & { progress?: CardProgress }
