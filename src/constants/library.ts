export const LIBRARY_COPY = {
  heading: 'Thư viện',
  searchPlaceholder: 'Tìm kiếm bộ thẻ',
  tabs: ['Bộ thẻ của tôi', 'Bộ thẻ của app', 'Sách giáo khoa', 'Cộng đồng'] as const,
  mySubTabs: ['Đang học', 'Cá nhân', 'Đã lưu'] as const,
  appSubTabs: ['Từ vựng', 'Ngữ pháp', 'Sách giáo khoa'] as const,
  communityCategories: [
    'Tất cả', 'Từ vựng cộng đồng', 'Ngữ pháp cộng đồng',
    'Anime', 'Manga', 'Âm nhạc', 'TV', 'Novel', 'Game', 'Sách giáo khoa', 'Khác',
  ] as const,
  systemBadge: 'Tacho',
  editorLabel: 'Biên tập viên Tacho',
  createdByPrefix: 'Tạo bởi',
  reviewLabel: 'Ôn tập',
  cardCountSuffix: 'thẻ',
  usersLearningSuffix: 'người học',
  vocabShort: 'từ',
  grammarShort: 'ngữ pháp',
  emptyState: 'Chưa có bộ thẻ nào.',
  bookmarkAriaLabel: 'Đánh dấu bộ thẻ',
  textbookGroupLabel: 'Giáo trình',
} as const

export type LibraryMainTab = (typeof LIBRARY_COPY.tabs)[number]
export type MySubTab = (typeof LIBRARY_COPY.mySubTabs)[number]
export type AppSubTab = (typeof LIBRARY_COPY.appSubTabs)[number]
export type CommunityCategory = (typeof LIBRARY_COPY.communityCategories)[number]

export interface DeckMock {
  id: string
  name: string
  coverIndex: number
  creator: string
  isSystemDeck: boolean
  vocabCount: number
  grammarCount: number
  totalCards: number
  learnedCards: number
  userCount: number
  isBookmarked: boolean
  reviewDue?: number
  category?: string
  textbook?: string
}

export const MOCK_STUDYING: DeckMock[] = [
  { id: 's1', name: 'JLPT N5 Từ vựng', coverIndex: 0, creator: 'Tacho', isSystemDeck: true, vocabCount: 200, grammarCount: 0, totalCards: 200, learnedCards: 52, userCount: 2400, isBookmarked: true, reviewDue: 8 },
  { id: 's2', name: 'Genki I – Chapter 1–5', coverIndex: 1, creator: 'Tacho', isSystemDeck: true, vocabCount: 90, grammarCount: 30, totalCards: 120, learnedCards: 30, userCount: 1100, isBookmarked: false, reviewDue: 0 },
  { id: 's3', name: 'Ngữ pháp N4', coverIndex: 3, creator: 'Tacho', isSystemDeck: true, vocabCount: 0, grammarCount: 50, totalCards: 50, learnedCards: 15, userCount: 890, isBookmarked: false, reviewDue: 5 },
]

export const MOCK_MY_DECKS: DeckMock[] = [
  { id: 'm1', name: 'Từ vựng anime yêu thích', coverIndex: 2, creator: 'Tôi', isSystemDeck: false, vocabCount: 45, grammarCount: 0, totalCards: 45, learnedCards: 0, userCount: 234, isBookmarked: false },
  { id: 'm2', name: 'Từ vựng công việc', coverIndex: 4, creator: 'Tôi', isSystemDeck: false, vocabCount: 30, grammarCount: 0, totalCards: 30, learnedCards: 0, userCount: 110, isBookmarked: false },
]

export const MOCK_SAVED: DeckMock[] = [
  { id: 'v1', name: 'JLPT N3 Cộng đồng', coverIndex: 1, creator: 'tanaka_jp', isSystemDeck: false, vocabCount: 280, grammarCount: 20, totalCards: 300, learnedCards: 0, userCount: 5600, isBookmarked: true },
  { id: 'v2', name: 'Minna no Nihongo I – Từ vựng', coverIndex: 0, creator: 'minna_fan', isSystemDeck: false, vocabCount: 200, grammarCount: 0, totalCards: 200, learnedCards: 0, userCount: 3200, isBookmarked: true },
]

export const MOCK_APP_VOCAB: DeckMock[] = [
  { id: 'av1', name: 'JLPT N5 Từ vựng – Đầy đủ', coverIndex: 0, creator: 'Tacho', isSystemDeck: true, vocabCount: 1000, grammarCount: 0, totalCards: 1000, learnedCards: 0, userCount: 12000, isBookmarked: false },
  { id: 'av2', name: 'JLPT N4 Từ vựng – Đầy đủ', coverIndex: 5, creator: 'Tacho', isSystemDeck: true, vocabCount: 1500, grammarCount: 0, totalCards: 1500, learnedCards: 0, userCount: 8700, isBookmarked: false },
  { id: 'av3', name: 'JLPT N3 Từ vựng – Đầy đủ', coverIndex: 4, creator: 'Tacho', isSystemDeck: true, vocabCount: 2000, grammarCount: 0, totalCards: 2000, learnedCards: 0, userCount: 6200, isBookmarked: false },
]

export const MOCK_APP_GRAMMAR: DeckMock[] = [
  { id: 'ag1', name: 'Ngữ pháp JLPT N5', coverIndex: 3, creator: 'Tacho', isSystemDeck: true, vocabCount: 0, grammarCount: 50, totalCards: 50, learnedCards: 0, userCount: 9400, isBookmarked: false },
  { id: 'ag2', name: 'Ngữ pháp JLPT N4', coverIndex: 1, creator: 'Tacho', isSystemDeck: true, vocabCount: 0, grammarCount: 80, totalCards: 80, learnedCards: 0, userCount: 6100, isBookmarked: false },
  { id: 'ag3', name: 'Ngữ pháp JLPT N3', coverIndex: 2, creator: 'Tacho', isSystemDeck: true, vocabCount: 0, grammarCount: 120, totalCards: 120, learnedCards: 0, userCount: 4300, isBookmarked: false },
]

export const MOCK_TEXTBOOKS: DeckMock[] = [
  { id: 'tb1', name: 'Genki I – Bộ thẻ đầy đủ', coverIndex: 0, creator: 'Tacho', isSystemDeck: true, vocabCount: 500, grammarCount: 100, totalCards: 600, learnedCards: 0, userCount: 15000, isBookmarked: false, textbook: 'Genki' },
  { id: 'tb2', name: 'Genki II – Bộ thẻ đầy đủ', coverIndex: 5, creator: 'Tacho', isSystemDeck: true, vocabCount: 500, grammarCount: 100, totalCards: 600, learnedCards: 0, userCount: 11000, isBookmarked: false, textbook: 'Genki' },
  { id: 'tb3', name: 'Minna no Nihongo I', coverIndex: 1, creator: 'Tacho', isSystemDeck: true, vocabCount: 400, grammarCount: 100, totalCards: 500, learnedCards: 0, userCount: 8900, isBookmarked: false, textbook: 'Minna no Nihongo' },
  { id: 'tb4', name: 'Nihongo So-matome N3', coverIndex: 4, creator: 'Tacho', isSystemDeck: true, vocabCount: 300, grammarCount: 100, totalCards: 400, learnedCards: 0, userCount: 4200, isBookmarked: false, textbook: 'So-matome' },
]

export const MOCK_COMMUNITY: DeckMock[] = [
  { id: 'c1', name: 'Từ vựng Jujutsu Kaisen', coverIndex: 2, creator: 'anime_fan99', isSystemDeck: false, vocabCount: 200, grammarCount: 0, totalCards: 200, learnedCards: 0, userCount: 3400, isBookmarked: false, category: 'Anime' },
  { id: 'c2', name: 'Slang Nhật hiện đại', coverIndex: 4, creator: 'nihongo_daily', isSystemDeck: false, vocabCount: 100, grammarCount: 0, totalCards: 100, learnedCards: 0, userCount: 2100, isBookmarked: true, category: 'Từ vựng cộng đồng' },
  { id: 'c3', name: 'Ngữ pháp N2 nâng cao', coverIndex: 3, creator: 'grammar_master', isSystemDeck: false, vocabCount: 0, grammarCount: 150, totalCards: 150, learnedCards: 0, userCount: 1800, isBookmarked: false, category: 'Ngữ pháp cộng đồng' },
  { id: 'c4', name: 'Attack on Titan – Từ vựng', coverIndex: 1, creator: 'aot_fan', isSystemDeck: false, vocabCount: 180, grammarCount: 0, totalCards: 180, learnedCards: 0, userCount: 2900, isBookmarked: false, category: 'Anime' },
  { id: 'c5', name: 'Từ vựng J-pop & J-rock', coverIndex: 5, creator: 'music_learner', isSystemDeck: false, vocabCount: 80, grammarCount: 0, totalCards: 80, learnedCards: 0, userCount: 1200, isBookmarked: false, category: 'Âm nhạc' },
  { id: 'c6', name: 'Persona 5 – Vocab Pack', coverIndex: 0, creator: 'gamer_jp', isSystemDeck: false, vocabCount: 250, grammarCount: 0, totalCards: 250, learnedCards: 0, userCount: 2500, isBookmarked: true, category: 'Game' },
]
