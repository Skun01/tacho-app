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
  createBtn: 'Tạo bộ thẻ',
} as const

export type LibraryMainTab = (typeof LIBRARY_COPY.tabs)[number]
export type MySubTab = (typeof LIBRARY_COPY.mySubTabs)[number]
export type AppSubTab = (typeof LIBRARY_COPY.appSubTabs)[number]
export type CommunityCategory = (typeof LIBRARY_COPY.communityCategories)[number]

