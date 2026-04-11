import type { CardType, JlptLevel, PublishStatus, SentenceItem, UserCardNoteItem } from '@/types/vocabulary'

export type GrammarCardType = Extract<CardType, 'Grammar'>
export type GrammarRegister = 'Standard' | 'Formal' | 'Polite' | 'Casual'
export type GrammarRelationType = 'Similar' | 'Contrasting'

export interface GrammarStructureItem {
  pattern: string
  annotations?: Record<string, string> | null
}

export interface GrammarRelationItem {
  relatedId: string
  relationType: GrammarRelationType
}

export interface GrammarResourceItem {
  id: string
  title: string
  url: string
}

export interface GrammarCardDetail {
  id: string
  cardType: GrammarCardType
  title: string
  summary: string
  level: JlptLevel | null
  tags: string[]
  status: PublishStatus
  createdAt: string
  updatedAt: string | null
  structures: GrammarStructureItem[]
  explanation: string
  caution: string | null
  register: GrammarRegister | null
  alternateForms: string[]
  relations: GrammarRelationItem[]
  resources: GrammarResourceItem[]
  sentences: SentenceItem[]
  userNotes: UserCardNoteItem[]
}
