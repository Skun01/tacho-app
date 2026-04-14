import type { CardType, JlptLevel, PublishStatus, UserCardNoteItem } from '@/types/vocabulary'

export type KanjiCardType = Extract<CardType, 'Kanji'>

// ─── Value Objects ──────────────────────────────────────────────────────────

export interface KanjiRadicalItem {
  id: string
  character: string
  meaningVi: string
  kanjiCardId: string | null
}

// ─── Card Detail (for detail page) ──────────────────────────────────────────

export interface KanjiCardDetail {
  // Card base fields
  id: string
  cardType: KanjiCardType
  title: string
  summary: string
  level: JlptLevel | null
  tags: string[]
  status: PublishStatus
  createdAt: string
  updatedAt: string | null

  // KanjiDetail
  kanji: string
  strokeCount: number
  strokeOrderUrl: string | null
  onyomi: string[]
  kunyomi: string[]
  hanViet: string | null
  meaningVi: string
  radicals: KanjiRadicalItem[]

  // Relations
  userNotes: UserCardNoteItem[]
}
