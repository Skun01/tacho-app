export const DECK_COPY = {
  createModal: {
    titleCreate: 'Tạo bộ thẻ mới',
    titleEdit: 'Chỉnh sửa thông tin bộ thẻ',
    nameLabel: 'Tiêu đề',
    namePlaceholder: 'Nhập tên bộ thẻ...',
    nameRequired: 'Tiêu đề là bắt buộc',
    descLabel: 'Mô tả',
    descPlaceholder: 'Mô tả ngắn về bộ thẻ...',
    categoryLabel: 'Phân loại',
    coverLabel: 'Ảnh bìa',
    coverHint: 'JPG, PNG, WEBP – tối đa 5MB',
    coverBtn: 'Chọn ảnh',
    coverChange: 'Đổi ảnh',
    createBtn: 'Tạo bộ thẻ',
    saveBtn: 'Lưu thay đổi',
    cancelBtn: 'Hủy',
  },
  editPage: {
    editInfoTooltip: 'Chỉnh sửa thông tin',
    addCardBtn: 'Thêm thẻ',
    importBtn: 'Import',
    importDisabledHint: 'Tính năng đang phát triển',
    deleteBtn: 'Xóa bộ thẻ',
    searchPlaceholder: 'Tìm thẻ trong bộ...',
    creatorLabel: 'Người tạo',
    typeLabel: 'Loại',
    vocabLabel: 'Từ vựng',
    grammarLabel: 'Ngữ pháp',
    emptyList: 'Chưa có thẻ nào. Nhấn "Thêm thẻ" để bắt đầu.',
    maxCardsHint: 'Tối đa 1000 thẻ/bộ',
    confirmDeleteTitle: 'Xóa bộ thẻ?',
    confirmDeleteMsg: 'Hành động này không thể hoàn tác.',
    confirmBtn: 'Xóa',
    cancelBtn: 'Hủy',
    dragHint: 'Kéo để sắp xếp',
    removeCardAriaLabel: 'Xóa thẻ khỏi bộ',
    savedToast: 'Đã lưu thông tin bộ thẻ!',
  },
  addCard: {
    title: 'Thêm thẻ vào bộ',
    searchPlaceholder: 'Tìm kiếm từ vựng, ngữ pháp...',
    addBtn: 'Thêm',
    removeBtn: 'Đã thêm',
    noResults: 'Không tìm thấy thẻ phù hợp.',
    masteryLabel: 'Thành thạo',
    typeVocab: 'Từ vựng',
    typeGrammar: 'Ngữ pháp',
    doneBtn: 'Xong',
  },
  viewPage: {
    addToReviewBtn: 'Thêm vào ôn tập',
    removeFromReviewBtn: 'Xóa khỏi ôn tập',
    saveBtn: 'Lưu bộ thẻ',
    savedBtn: 'Đã lưu',
    cloneBtn: 'Sao chép',
    editBtn: 'Chỉnh sửa',
    cloneNameSuffix: '(bản sao)',
    clonedToast: 'Đã sao chép bộ thẻ!',
    savedToast: 'Đã lưu bộ thẻ!',
    perPage: 20,
    prevPage: 'Trước',
    nextPage: 'Tiếp',
    vocabLabel: 'Từ vựng',
    grammarLabel: 'Ngữ pháp',
    creatorLabel: 'Người tạo',
    totalCardsLabel: 'Tổng số thẻ',
  },
} as const

export const DECK_CATEGORIES = [
  'Mặc định', 'Từ vựng', 'Ngữ pháp', 'Anime', 'Manga',
  'Âm nhạc', 'TV', 'Novel', 'Game', 'Sách giáo khoa', 'Khác',
] as const

export type DeckCategory = (typeof DECK_CATEGORIES)[number]

export interface FlashCard {
  id: string
  type: 'vocab' | 'grammar'
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  content: string
  reading?: string
  meaning: string
  masteryLevel?: number
}

export interface EditableDeck {
  id: string
  name: string
  description: string
  category: DeckCategory
  creator: string
  isOwner: boolean
  isInReview: boolean
  isSaved: boolean
  cards: FlashCard[]
}

export const MOCK_CARDS_LIBRARY: FlashCard[] = [
  { id: 'fc1', type: 'vocab', jlptLevel: 'N5', content: '私', reading: 'わたし', meaning: 'Tôi, ta', masteryLevel: 4 },
  { id: 'fc2', type: 'vocab', jlptLevel: 'N5', content: '食べる', reading: 'たべる', meaning: 'Ăn', masteryLevel: 3 },
  { id: 'fc3', type: 'vocab', jlptLevel: 'N5', content: '飲む', reading: 'のむ', meaning: 'Uống' },
  { id: 'fc4', type: 'vocab', jlptLevel: 'N5', content: '学校', reading: 'がっこう', meaning: 'Trường học', masteryLevel: 5 },
  { id: 'fc5', type: 'vocab', jlptLevel: 'N5', content: '友達', reading: 'ともだち', meaning: 'Bạn bè', masteryLevel: 2 },
  { id: 'fc6', type: 'vocab', jlptLevel: 'N5', content: '電車', reading: 'でんしゃ', meaning: 'Tàu điện' },
  { id: 'fc7', type: 'vocab', jlptLevel: 'N5', content: '図書館', reading: 'としょかん', meaning: 'Thư viện' },
  { id: 'fc8', type: 'grammar', jlptLevel: 'N5', content: '〜です／〜ます', meaning: 'Hình thức lịch sự của động từ và tính từ', masteryLevel: 4 },
  { id: 'fc9', type: 'grammar', jlptLevel: 'N5', content: '〜は〜が好きです', meaning: '... thích ...' },
  { id: 'fc10', type: 'grammar', jlptLevel: 'N5', content: '〜ください', meaning: 'Xin hãy làm...' },
  { id: 'fc11', type: 'vocab', jlptLevel: 'N4', content: '仕事', reading: 'しごと', meaning: 'Công việc', masteryLevel: 1 },
  { id: 'fc12', type: 'vocab', jlptLevel: 'N4', content: '会社', reading: 'かいしゃ', meaning: 'Công ty' },
  { id: 'fc13', type: 'vocab', jlptLevel: 'N4', content: '難しい', reading: 'むずかしい', meaning: 'Khó' },
  { id: 'fc14', type: 'vocab', jlptLevel: 'N4', content: '勉強', reading: 'べんきょう', meaning: 'Học bài', masteryLevel: 3 },
  { id: 'fc15', type: 'grammar', jlptLevel: 'N4', content: '〜たら', meaning: 'Điều kiện: nếu... thì...' },
  { id: 'fc16', type: 'grammar', jlptLevel: 'N4', content: '〜なければならない', meaning: 'Phải làm gì đó (bắt buộc)' },
  { id: 'fc17', type: 'grammar', jlptLevel: 'N4', content: '〜ている', meaning: 'Đang làm hoặc trạng thái hiện tại', masteryLevel: 2 },
  { id: 'fc18', type: 'vocab', jlptLevel: 'N3', content: '美しい', reading: 'うつくしい', meaning: 'Đẹp (văn chương)' },
  { id: 'fc19', type: 'vocab', jlptLevel: 'N3', content: '経験', reading: 'けいけん', meaning: 'Kinh nghiệm' },
  { id: 'fc20', type: 'grammar', jlptLevel: 'N3', content: '〜だけでなく', meaning: 'Không chỉ... mà còn...' },
]

export const MOCK_DECK_EDIT: EditableDeck = {
  id: 'me1',
  name: 'Từ vựng N5 của tôi',
  description: 'Bộ thẻ từ vựng N5 tôi tự tổng hợp để luyện tập hàng ngày.',
  category: 'Từ vựng',
  creator: 'Tôi',
  isOwner: true,
  isInReview: true,
  isSaved: false,
  cards: [
    MOCK_CARDS_LIBRARY[0],
    MOCK_CARDS_LIBRARY[1],
    MOCK_CARDS_LIBRARY[4],
    MOCK_CARDS_LIBRARY[7],
    MOCK_CARDS_LIBRARY[3],
  ],
}

export const MOCK_DECK_VIEW: EditableDeck = {
  id: 'mv1',
  name: 'JLPT N5 Từ vựng – Đầy đủ',
  description: 'Toàn bộ từ vựng cần thiết cho kỳ thi JLPT N5, được biên soạn bởi đội ngũ biên tập Tacho.',
  category: 'Từ vựng',
  creator: 'Biên tập viên Tacho',
  isOwner: false,
  isInReview: false,
  isSaved: false,
  cards: MOCK_CARDS_LIBRARY,
}
