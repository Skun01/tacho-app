export const SEARCH_COPY = {
  pageTitle: 'Tìm kiếm',
  inputPlaceholder: 'Nhập từ vựng, kanji, hoặc nghĩa tiếng Việt...',
  resultCount: (count: number, query: string) =>
    `${count} kết quả cho "${query}"`,
  noResults: 'Không tìm thấy kết quả',
  noResultsHint: 'Thử tìm với từ khóa khác hoặc bỏ bớt bộ lọc',
  filters: {
    level: 'Trình độ',
    partOfSpeech: 'Loại từ',
    clearAll: 'Xóa bộ lọc',
  },
} as const

export const JLPT_LEVEL_LABELS: Record<string, string> = {
  N5: 'N5',
  N4: 'N4',
  N3: 'N3',
  N2: 'N2',
  N1: 'N1',
} as const

export const PART_OF_SPEECH_LABELS: Record<string, string> = {
  Noun: 'Danh từ',
  VerbU: 'Động từ nhóm I',
  VerbRu: 'Động từ nhóm II',
  IAdj: 'Tính từ đuôi i',
  NaAdj: 'Tính từ đuôi na',
  Adverb: 'Phó từ',
  Particle: 'Trợ từ',
  Conjunction: 'Liên từ',
  Interjection: 'Thán từ',
} as const

export const WORD_TYPE_LABELS: Record<string, string> = {
  Native: '和語',
  SinoJapanese: '漢語',
  Loanword: '外来語',
} as const
