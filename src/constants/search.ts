export const SEARCH_COPY = {
  pageTitle: 'Tìm kiếm',
  pageDescription: 'Tìm kiếm thẻ học tiếng Nhật trên Tacho.',
  inputPlaceholder: 'Nhập nội dung muốn tìm...',
  resultCount: (count: number, query: string) =>
    `${count} kết quả cho "${query}"`,
  cardTypeLabel: {
    Vocab: 'Từ vựng',
    Grammar: 'Ngữ pháp',
  },
  cardTypePill: {
    Vocab: 'Vocab',
    Grammar: 'Grammar',
  },
  noResults: 'Không tìm thấy kết quả',
  noResultsHint: 'Thử đổi từ khóa hoặc bỏ bớt bộ lọc.',
  noResultsCta: 'Quay lại trang chủ',
  filters: {
    cardType: 'Loại thẻ',
    allTypes: 'Tất cả',
    level: 'Trình độ',
    clearAll: 'Xóa bộ lọc',
  },
  grammarAlternateForms: 'Dạng thay thế',
  searchError: 'Không thể tải kết quả tìm kiếm. Vui lòng thử lại.',
} as const

export const JLPT_LEVEL_LABELS: Record<string, string> = {
  N5: 'N5',
  N4: 'N4',
  N3: 'N3',
  N2: 'N2',
  N1: 'N1',
} as const

export const SEARCH_CARD_TYPE_OPTIONS = [
  { value: undefined, label: SEARCH_COPY.filters.allTypes },
  { value: 'Vocab', label: SEARCH_COPY.cardTypeLabel.Vocab },
  { value: 'Grammar', label: SEARCH_COPY.cardTypeLabel.Grammar },
] as const

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
