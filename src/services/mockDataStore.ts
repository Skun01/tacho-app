import type { ApiResponse } from '@/types/api'
import type { AuthDTO, LoginRequest, RegisterRequest, UserDTO } from '@/types/auth'
import type {
  CardDetail,
  CardProgress,
  CardProgressDetail,
  FlashCard,
  FlashCardWithProgress,
  JlptLevel,
} from '@/types/card'
import type {
  CreateDeckPayload,
  DeckDetailWithState,
  DeckListItem,
  ListDecksParams,
  ReorderCardsPayload,
  UpdateDeckPayload,
} from '@/types/deck'
import type { ActivityPoint, DashboardSummary, StreakDay } from '@/types/dashboard'
import { MOCK_CARDS, MOCK_CARDS_WITH_PROGRESS } from '@/mocks/cards'
import { MOCK_VOCAB_DETAILS, MOCK_GRAMMAR_DETAILS } from '@/mocks/cardDetails'
import {
  MOCK_APP_GRAMMAR_DECKS,
  MOCK_APP_VOCAB_DECKS,
  MOCK_COMMUNITY_DECKS,
  MOCK_MY_OWN_DECKS,
  MOCK_SAVED_DECKS,
  MOCK_STUDYING_DECKS,
  MOCK_TEXTBOOK_DECKS,
} from '@/mocks/decks'

type AuthRecord = UserDTO & { password: string }

type QuizCommitItem = { cardId: string; before: number; after: number }

type MockState = {
  authUsers: Record<string, AuthRecord>
  currentUserId: string | null
  resetTokens: Set<string>
  deckDetails: Record<string, DeckDetailWithState>
  cardProgress: Record<string, CardProgress>
  cardDetailProgress: Record<string, CardProgressDetail>
  activity: ActivityPoint[]
  streakCalendar: StreakDay[]
}

const LEVELS: JlptLevel[] = ['N1', 'N2', 'N3', 'N4', 'N5']
const ALL_LIST_SEEDS: DeckListItem[] = [
  ...MOCK_STUDYING_DECKS,
  ...MOCK_MY_OWN_DECKS,
  ...MOCK_SAVED_DECKS,
  ...MOCK_APP_VOCAB_DECKS,
  ...MOCK_APP_GRAMMAR_DECKS,
  ...MOCK_TEXTBOOK_DECKS,
  ...MOCK_COMMUNITY_DECKS,
]

function clone<T>(value: T): T {
  return structuredClone(value)
}

function wait<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(clone(value)), ms))
}

function createApiResponse<T>(data: T): { data: ApiResponse<T> } {
  return {
    data: {
      code: 200,
      success: true,
      message: null,
      data: clone(data),
      metaData: null,
    },
  }
}

function toFlashCardWithProgress(card: FlashCard, state: MockState): FlashCardWithProgress {
  const progress = state.cardProgress[card.id]
  return progress ? { ...clone(card), progress: clone(progress) } : clone(card)
}

function toCardProgressDetail(existing: CardProgressDetail | undefined, progress: CardProgress): CardProgressDetail {
  const now = new Date().toISOString()
  const currentStage = existing?.masteryStage ?? Math.max(0, Math.min(14, progress.masteryLevel * 3))
  return {
    masteryStage: Math.max(0, Math.min(14, currentStage)),
    firstLearnedAt: existing?.firstLearnedAt ?? now,
    lastReviewedAt: existing?.lastReviewedAt ?? now,
    nextReviewAt: progress.nextReviewAt ?? existing?.nextReviewAt ?? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    reviewCount: existing?.reviewCount ?? progress.masteryLevel,
  }
}

function getDeckCardPool(seed: DeckListItem): FlashCard[] {
  const levelMatch = seed.name.match(/N[1-5]/)?.[0] as JlptLevel | undefined
  const byLevel = levelMatch ? MOCK_CARDS.filter((card) => card.jlptLevel === levelMatch) : MOCK_CARDS
  let primaryPool = byLevel.length > 0 ? byLevel : MOCK_CARDS

  if (seed.category === 'Ngữ pháp') {
    primaryPool = primaryPool.filter((card) => card.type === 'grammar')
  } else if (seed.category !== 'Sách giáo khoa') {
    primaryPool = primaryPool.filter((card) => card.type === 'vocab')
  }

  if (primaryPool.length === 0) {
    primaryPool = byLevel.length > 0 ? byLevel : MOCK_CARDS
  }

  const mixedPool = primaryPool.length >= 6 ? primaryPool : byLevel.length > 0 ? byLevel : MOCK_CARDS
  const rotated = mixedPool.slice()
  const offset = seed.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % Math.max(1, rotated.length)
  const ordered = [...rotated.slice(offset), ...rotated.slice(0, offset)]
  const targetSize = seed.isOwner ? 8 : seed.category === 'Sách giáo khoa' ? 10 : 6
  return ordered.slice(0, Math.min(targetSize, ordered.length)).map(clone)
}

function deriveDeckCounts(cards: FlashCard[], state: MockState) {
  const vocabCount = cards.filter((card) => card.type === 'vocab').length
  const grammarCount = cards.filter((card) => card.type === 'grammar').length
  const learnedCards = cards.filter((card) => (state.cardProgress[card.id]?.masteryLevel ?? 0) > 0).length
  const reviewDue = cards.filter((card) => state.cardProgress[card.id]?.isInReview).length
  return {
    totalCards: cards.length,
    vocabCount,
    grammarCount,
    learnedCards,
    reviewDue,
  }
}

function createDeckDetail(seed: DeckListItem, state: MockState): DeckDetailWithState {
  const cards = getDeckCardPool(seed)
  const counts = deriveDeckCounts(cards, state)
  return {
    ...clone(seed),
    ...counts,
    cards,
  }
}

function seedCardDetailProgress(): Record<string, CardProgressDetail> {
  const detailValues: CardDetail[] = [
    ...Object.values(MOCK_VOCAB_DETAILS),
    ...Object.values(MOCK_GRAMMAR_DETAILS),
  ]
  const entries = detailValues
    .filter((detail) => detail.userProgress !== undefined)
    .map((detail) => [detail.id, clone(detail.userProgress!)])
  return Object.fromEntries(entries)
}

function seedCardProgress(): Record<string, CardProgress> {
  const entries = MOCK_CARDS_WITH_PROGRESS
    .filter((card) => card.progress !== undefined)
    .map((card) => [card.id, clone(card.progress!)])
  return Object.fromEntries(entries)
}

function buildInitialState(): MockState {
  const authUsers: Record<string, AuthRecord> = {
    'demo@tacho.app': {
      id: 'user-1',
      email: 'demo@tacho.app',
      displayName: 'Người học Tacho',
      avatarUrl: undefined,
      createdAt: '2025-01-01T00:00:00Z',
      password: '12345678',
    },
  }

  const state: MockState = {
    authUsers,
    currentUserId: null,
    resetTokens: new Set(['mock-reset-token']),
    deckDetails: {},
    cardProgress: seedCardProgress(),
    cardDetailProgress: seedCardDetailProgress(),
    activity: [
      { date: '08 CN', vocab: 20, grammar: 12 },
      { date: '09 T2', vocab: 50, grammar: 18 },
      { date: '10 T3', vocab: 32, grammar: 48 },
      { date: '11 T4', vocab: 68, grammar: 28 },
      { date: '12 T5', vocab: 42, grammar: 62 },
      { date: '13 T6', vocab: 78, grammar: 38 },
      { date: '14 T7', vocab: 55, grammar: 70 },
      { date: '15 CN', vocab: 38, grammar: 50 },
    ],
    streakCalendar: [
      { label: '9/8', active: false },
      { label: '14/8', active: false },
      { label: '17/8', active: false },
      { label: '18木', active: true },
      { label: '19木', active: true },
      { label: '20土', active: true },
      { label: '21土', active: true },
    ],
  }

  state.deckDetails = Object.fromEntries(
    ALL_LIST_SEEDS.map((seed) => [seed.id, createDeckDetail(seed, state)]),
  )

  return state
}

const state = buildInitialState()

function getAllDecks(): DeckDetailWithState[] {
  return Object.values(state.deckDetails)
}

function getCurrentUser(): UserDTO | null {
  if (!state.currentUserId) return null
  const user = Object.values(state.authUsers).find((item) => item.id === state.currentUserId)
  if (!user) return null
  const { password: _password, ...rest } = user
  return clone(rest)
}

function getCardById(cardId: string): FlashCard | null {
  return MOCK_CARDS.find((card) => card.id === cardId) ?? null
}

function getCardDetailById(cardId: string): CardDetail | null {
  const vocab = MOCK_VOCAB_DETAILS[cardId]
  const grammar = MOCK_GRAMMAR_DETAILS[cardId]
  const base = vocab ?? grammar
  if (!base) return null
  const progress = state.cardProgress[cardId]
  const detailProgress = progress
    ? toCardProgressDetail(state.cardDetailProgress[cardId], progress)
    : state.cardDetailProgress[cardId]
  if (detailProgress) {
    state.cardDetailProgress[cardId] = clone(detailProgress)
  }
  return {
    ...clone(base),
    userProgress: detailProgress ? clone(detailProgress) : undefined,
  }
}

function pickBatchIdsFromDeck(deck: DeckDetailWithState, size = 5): string[] {
  return deck.cards
    .slice()
    .sort((left, right) => {
      const leftProgress = state.cardProgress[left.id]?.masteryLevel ?? 0
      const rightProgress = state.cardProgress[right.id]?.masteryLevel ?? 0
      return leftProgress - rightProgress
    })
    .slice(0, Math.min(size, deck.cards.length))
    .map((card) => card.id)
}

function buildDashboardSummary(): DashboardSummary {
  const activeDecks = getAllDecks()
    .filter((deck) => deck.isInReview)
    .sort((left, right) => right.reviewDue - left.reviewDue)

  const learnDecks = activeDecks.slice(0, 2).map((deck) => ({
    id: deck.id,
    name: deck.name,
    due: deck.reviewDue || Math.min(5, deck.cards.length),
    batchIds: pickBatchIdsFromDeck(deck, 5),
  }))

  const learnBatchIds = Array.from(new Set(learnDecks.flatMap((deck) => deck.batchIds))).slice(0, 9)
  const learnCompletedCount = learnBatchIds.filter((cardId) => (state.cardProgress[cardId]?.masteryLevel ?? 0) >= 3).length

  const reviewCards = activeDecks.flatMap((deck) =>
    deck.cards.filter((card) => state.cardProgress[card.id]?.isInReview),
  )
  const uniqueReviewCards = Array.from(new Map(reviewCards.map((card) => [card.id, card])).values())

  const vocabProgress = [0, 0, 0, 0, 0]
  const grammarProgress = [0, 0, 0, 0, 0]
  MOCK_CARDS.forEach((card) => {
    const mastery = state.cardProgress[card.id]?.masteryLevel ?? 0
    const bucket = mastery === 0 ? 0 : mastery <= 2 ? 1 : mastery === 3 ? 2 : mastery === 4 ? 3 : 4
    if (card.type === 'vocab') {
      vocabProgress[bucket] += 1
    } else {
      grammarProgress[bucket] += 1
    }
  })

  const jlpt = {
    'Từ vựng': LEVELS.map((level) => {
      const cards = MOCK_CARDS.filter((card) => card.type === 'vocab' && card.jlptLevel === level)
      const current = cards.filter((card) => (state.cardProgress[card.id]?.masteryLevel ?? 0) >= 3).length
      return { level, current, total: cards.length, done: current === cards.length && cards.length > 0 }
    }),
    'Ngữ pháp': LEVELS.map((level) => {
      const cards = MOCK_CARDS.filter((card) => card.type === 'grammar' && card.jlptLevel === level)
      const current = cards.filter((card) => (state.cardProgress[card.id]?.masteryLevel ?? 0) >= 3).length
      return { level, current, total: cards.length, done: current === cards.length && cards.length > 0 }
    }),
    'Cả hai': LEVELS.map((level) => {
      const cards = MOCK_CARDS.filter((card) => card.jlptLevel === level)
      const current = cards.filter((card) => (state.cardProgress[card.id]?.masteryLevel ?? 0) >= 3).length
      return { level, current, total: cards.length, done: current === cards.length && cards.length > 0 }
    }),
  } satisfies DashboardSummary['personal']['jlpt']

  return {
    learn: {
      totalTarget: Math.max(learnBatchIds.length, 5),
      completedCount: learnCompletedCount,
      batchIds: learnBatchIds,
      decks: learnDecks,
    },
    review: {
      totalDue: uniqueReviewCards.length,
      vocab: uniqueReviewCards.filter((card) => card.type === 'vocab').length,
      grammar: uniqueReviewCards.filter((card) => card.type === 'grammar').length,
      batchIds: uniqueReviewCards.map((card) => card.id),
    },
    progress: {
      vocab: vocabProgress,
      grammar: grammarProgress,
    },
    personal: {
      activity: clone(state.activity),
      streakDays: state.streakCalendar.filter((day) => day.active).length,
      streakCalendar: clone(state.streakCalendar),
      jlpt,
    },
  }
}

function getDefaultStudyBatchIds(mode: 'learn' | 'review' = 'learn'): string[] {
  const dashboard = buildDashboardSummary()
  return mode === 'review'
    ? dashboard.review.batchIds.slice(0, 10)
    : dashboard.learn.batchIds.length > 0
      ? dashboard.learn.batchIds
      : dashboard.review.batchIds.slice(0, 8)
}

function applyDeckCounts(deck: DeckDetailWithState): DeckDetailWithState {
  const counts = deriveDeckCounts(deck.cards, state)
  return {
    ...deck,
    ...counts,
  }
}

function getFilteredDecks(params: ListDecksParams = {}): DeckListItem[] {
  let decks = getAllDecks().map((deck) => applyDeckCounts(deck))
  if (params.source !== undefined) decks = decks.filter((deck) => deck.source === params.source)
  if (params.category !== undefined) decks = decks.filter((deck) => deck.category === params.category)
  if (params.isOwner !== undefined) decks = decks.filter((deck) => deck.isOwner === params.isOwner)
  if (params.isInReview !== undefined) decks = decks.filter((deck) => deck.isInReview === params.isInReview)
  if (params.isSaved !== undefined) decks = decks.filter((deck) => deck.isSaved === params.isSaved)
  if (params.textbook !== undefined) decks = decks.filter((deck) => deck.textbook === params.textbook)
  if (params.search) {
    const query = params.search.toLowerCase()
    decks = decks.filter(
      (deck) =>
        deck.name.toLowerCase().includes(query) ||
        deck.ownerName.toLowerCase().includes(query),
    )
  }
  return decks.map(clone)
}

function assertDeck(deckId: string): DeckDetailWithState {
  const deck = state.deckDetails[deckId]
  if (!deck) {
    throw new Error('DECK_NOT_FOUND')
  }
  return deck
}

export const mockDataStore = {
  async login(payload: LoginRequest): Promise<{ data: ApiResponse<AuthDTO> }> {
    const user = state.authUsers[payload.email.toLowerCase()]
    if (!user || user.password !== payload.password) {
      throw new Error('INVALID_CREDENTIALS')
    }
    state.currentUserId = user.id
    const { password: _password, ...safeUser } = user
    return wait(createApiResponse<AuthDTO>({
      accessToken: `mock-token-${user.id}`,
      user: safeUser,
    }))
  },

  async register(payload: RegisterRequest): Promise<{ data: ApiResponse<AuthDTO> }> {
    const email = payload.email.toLowerCase()
    if (state.authUsers[email]) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }
    const user: AuthRecord = {
      id: `user-${Date.now()}`,
      email,
      displayName: payload.displayName,
      avatarUrl: undefined,
      createdAt: new Date().toISOString(),
      password: payload.password,
    }
    state.authUsers[email] = user
    state.currentUserId = user.id
    const { password: _password, ...safeUser } = user
    return wait(createApiResponse<AuthDTO>({
      accessToken: `mock-token-${user.id}`,
      user: safeUser,
    }))
  },

  async refresh(): Promise<{ data: ApiResponse<{ accessToken: string }> }> {
    const user = getCurrentUser()
    if (!user) {
      throw new Error('UNAUTHORIZED')
    }
    return wait(createApiResponse({ accessToken: `mock-token-${user.id}` }))
  },

  async logout(): Promise<{ data: ApiResponse<null> }> {
    state.currentUserId = null
    return wait(createApiResponse<null>(null))
  },

  async forgotPassword(email: string): Promise<{ token: string }> {
    const user = state.authUsers[email.toLowerCase()]
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    const token = `reset-${Date.now()}`
    state.resetTokens.add(token)
    return wait({ token })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    if (!state.resetTokens.has(token)) {
      throw new Error('INVALID_RESET_TOKEN')
    }
    const currentUser = getCurrentUser()
    const targetUser = currentUser ? state.authUsers[currentUser.email.toLowerCase()] : Object.values(state.authUsers)[0]
    if (!targetUser) {
      throw new Error('USER_NOT_FOUND')
    }
    targetUser.password = password
    state.resetTokens.delete(token)
    await wait(undefined)
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const currentUser = getCurrentUser()
    if (!currentUser) throw new Error('UNAUTHENTICATED')
    const record = state.authUsers[currentUser.email.toLowerCase()]
    if (!record || record.password !== currentPassword) {
      throw new Error('WRONG_CURRENT_PASSWORD')
    }
    record.password = newPassword
    await wait(undefined)
  },

  async updateDisplayName(name: string): Promise<void> {
    const currentUser = getCurrentUser()
    if (!currentUser) throw new Error('UNAUTHENTICATED')
    const record = state.authUsers[currentUser.email.toLowerCase()]
    if (!record) throw new Error('USER_NOT_FOUND')
    record.displayName = name
    await wait(undefined)
  },

  async listDecks(params: ListDecksParams = {}): Promise<DeckListItem[]> {
    return wait(getFilteredDecks(params))
  },

  async getDeckDetail(deckId: string): Promise<DeckDetailWithState> {
    const deck = applyDeckCounts(assertDeck(deckId))
    state.deckDetails[deckId] = deck
    return wait(deck)
  },

  async createDeck(payload: CreateDeckPayload): Promise<DeckDetailWithState> {
    const user = getCurrentUser()
    const deck: DeckDetailWithState = {
      id: `deck-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      category: payload.category,
      source: 'user',
      coverIndex: 0,
      coverUrl: payload.coverUrl,
      ownerId: user?.id ?? 'user-1',
      ownerName: user?.displayName ?? 'Tôi',
      isPublic: payload.isPublic,
      totalCards: 0,
      vocabCount: 0,
      grammarCount: 0,
      userCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: [],
      isOwner: true,
      isBookmarked: false,
      isSaved: false,
      isInReview: false,
      learnedCards: 0,
      reviewDue: 0,
    }
    state.deckDetails[deck.id] = deck
    return wait(deck)
  },

  async updateDeck(deckId: string, payload: UpdateDeckPayload): Promise<void> {
    const deck = assertDeck(deckId)
    state.deckDetails[deckId] = {
      ...deck,
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    await wait(undefined)
  },

  async deleteDeck(deckId: string): Promise<void> {
    delete state.deckDetails[deckId]
    await wait(undefined)
  },

  async addCardsToDeck(deckId: string, cardIds: string[]): Promise<void> {
    const deck = assertDeck(deckId)
    const existingIds = new Set(deck.cards.map((card) => card.id))
    const nextCards = cardIds
      .filter((cardId) => !existingIds.has(cardId))
      .map((cardId) => getCardById(cardId))
      .filter((card): card is FlashCard => card !== null)
    state.deckDetails[deckId] = applyDeckCounts({
      ...deck,
      cards: [...deck.cards, ...nextCards],
      updatedAt: new Date().toISOString(),
    })
    await wait(undefined)
  },

  async removeCardFromDeck(deckId: string, cardId: string): Promise<void> {
    const deck = assertDeck(deckId)
    state.deckDetails[deckId] = applyDeckCounts({
      ...deck,
      cards: deck.cards.filter((card) => card.id !== cardId),
      updatedAt: new Date().toISOString(),
    })
    await wait(undefined)
  },

  async reorderCards(deckId: string, payload: ReorderCardsPayload): Promise<void> {
    const deck = assertDeck(deckId)
    const cardMap = new Map(deck.cards.map((card) => [card.id, card]))
    const orderedCards = payload.orderedCardIds
      .map((cardId) => cardMap.get(cardId))
      .filter((card): card is FlashCard => card !== undefined)
    state.deckDetails[deckId] = {
      ...deck,
      cards: orderedCards,
      updatedAt: new Date().toISOString(),
    }
    await wait(undefined)
  },

  async toggleDeckBookmark(deckId: string, bookmarked: boolean): Promise<void> {
    const deck = assertDeck(deckId)
    state.deckDetails[deckId] = {
      ...deck,
      isBookmarked: bookmarked,
      updatedAt: new Date().toISOString(),
    }
    await wait(undefined)
  },

  async toggleDeckSaved(deckId: string, saved: boolean): Promise<void> {
    const deck = assertDeck(deckId)
    state.deckDetails[deckId] = {
      ...deck,
      isSaved: saved,
      updatedAt: new Date().toISOString(),
    }
    await wait(undefined)
  },

  async toggleDeckInReview(deckId: string, inReview: boolean): Promise<void> {
    const deck = assertDeck(deckId)
    state.deckDetails[deckId] = {
      ...deck,
      isInReview: inReview,
      updatedAt: new Date().toISOString(),
    }
    deck.cards.forEach((card) => {
      const current = state.cardProgress[card.id] ?? {
        cardId: card.id,
        masteryLevel: 0,
        isInReview: false,
        isSaved: false,
      }
      state.cardProgress[card.id] = {
        ...current,
        isInReview: inReview,
      }
    })
    await wait(undefined)
  },

  async cloneDeck(deckId: string): Promise<DeckDetailWithState> {
    const deck = assertDeck(deckId)
    const user = getCurrentUser()
    const nextDeck: DeckDetailWithState = {
      ...clone(deck),
      id: `deck-${Date.now()}`,
      name: `${deck.name} (bản sao)`,
      source: 'user',
      ownerId: user?.id ?? 'user-1',
      ownerName: user?.displayName ?? 'Tôi',
      isPublic: false,
      isOwner: true,
      isBookmarked: false,
      isSaved: false,
      isInReview: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    state.deckDetails[nextDeck.id] = applyDeckCounts(nextDeck)
    return wait(state.deckDetails[nextDeck.id])
  },

  async searchCards(query: string): Promise<FlashCardWithProgress[]> {
    const normalized = query.trim().toLowerCase()
    const cards = MOCK_CARDS.map((card) => toFlashCardWithProgress(card, state))
    if (!normalized) {
      return wait(cards)
    }
    return wait(
      cards.filter(
        (card) =>
          card.content.toLowerCase().includes(normalized) ||
          (card.type === 'vocab' && card.reading.toLowerCase().includes(normalized)) ||
          card.meaning.toLowerCase().includes(normalized),
      ),
    )
  },

  async getCard(cardId: string): Promise<FlashCardWithProgress | null> {
    const card = getCardById(cardId)
    return wait(card ? toFlashCardWithProgress(card, state) : null)
  },

  async getCardsByIds(cardIds: string[]): Promise<FlashCard[]> {
    const idSet = new Set(cardIds)
    return wait(MOCK_CARDS.filter((card) => idSet.has(card.id)).map(clone))
  },

  async getCardDetail(cardId: string): Promise<CardDetail | null> {
    return wait(getCardDetailById(cardId))
  },

  async updateCardProgress(cardId: string, patch: Partial<CardProgress>): Promise<FlashCardWithProgress> {
    const current = state.cardProgress[cardId] ?? {
      cardId,
      masteryLevel: 0,
      isInReview: false,
      isSaved: false,
    }
    const next = {
      ...current,
      ...patch,
      cardId,
    }
    state.cardProgress[cardId] = next
    state.cardDetailProgress[cardId] = toCardProgressDetail(state.cardDetailProgress[cardId], next)
    const card = getCardById(cardId)
    if (!card) {
      throw new Error('CARD_NOT_FOUND')
    }
    return wait(toFlashCardWithProgress(card, state))
  },

  async commitQuizProgress(changes: QuizCommitItem[]): Promise<void> {
    changes.forEach((change) => {
      const current = state.cardProgress[change.cardId] ?? {
        cardId: change.cardId,
        masteryLevel: 0,
        isInReview: true,
        isSaved: false,
      }
      state.cardProgress[change.cardId] = {
        ...current,
        masteryLevel: Math.max(0, Math.min(5, Math.round((change.after / 14) * 5))),
        isInReview: true,
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      }
      state.cardDetailProgress[change.cardId] = {
        masteryStage: change.after,
        firstLearnedAt: state.cardDetailProgress[change.cardId]?.firstLearnedAt ?? new Date().toISOString(),
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        reviewCount: (state.cardDetailProgress[change.cardId]?.reviewCount ?? 0) + 1,
      }
    })
    await wait(undefined)
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    return wait(buildDashboardSummary())
  },

  async getStudyBatchIds(mode: 'learn' | 'review' = 'learn'): Promise<string[]> {
    return wait(getDefaultStudyBatchIds(mode))
  },

  getCurrentUser,
}
