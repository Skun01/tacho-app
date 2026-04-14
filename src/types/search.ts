import type { JlptLevel } from '@/types/vocabulary'

export type SearchCardType = 'Vocab' | 'Grammar' | 'Kanji'

export interface SearchCardSummary {
  id: string
  cardType: SearchCardType
  title: string
  summary: string
  level: JlptLevel | null
  alternateForms: string[]
}

export interface SearchCardsParams {
  q: string
  cardType?: SearchCardType
  level?: JlptLevel
  page?: number
  pageSize?: number
}
