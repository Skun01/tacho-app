export const VOCAB_DETAIL_COPY = {
  pageTitle: (word: string) => `${word} — Chi tiết từ vựng`,
  back: 'Quay lại',

  // Hero section
  cardType: 'Từ vựng',

  // Chi tiết card
  detail: {
    title: 'CHI TIẾT',
    dictMeaning: 'NGHĨA TỪ ĐIỂN',
    reading: 'CÁCH ĐỌC',
  },

  // Sidebar actions
  actions: {
    addNote: 'Thêm ghi chú',
    addToDeck: 'Thêm vào bộ thẻ',
  },

  // Tiến trình học (placeholder — data SRS chưa có)
  progress: {
    title: 'TIẾN TRÌNH HỌC',
    nextReview: 'Ôn tập tiếp theo',
    firstLearned: 'Học lần đầu',
    reviewCount: 'Số lần đã ôn',
    comingSoon: 'Sắp ra mắt',
  },

  // Ví dụ
  examples: {
    title: 'VÍ DỤ',
    showMeaning: 'Hiện nghĩa',
    hideMeaning: 'Ẩn nghĩa',
  },

  // Từ liên quan
  related: {
    title: 'TỪ LIÊN QUAN',
    synonyms: 'Đồng nghĩa',
    antonyms: 'Trái nghĩa',
    phrases: 'Cụm từ liên quan',
  },

  // Ghi chú cộng đồng
  notes: {
    title: 'GHI CHÚ CỘNG ĐỒNG',
    placeholder: 'Viết ghi chú để chia sẻ mẹo nhớ, cách dùng, hay bất cứ gì hữu ích...',
    submit: 'Gửi ghi chú',
    empty: 'Chưa có ghi chú nào',
    emptyHint: 'Hãy là người đầu tiên chia sẻ ghi chú cho từ này!',
    deleteConfirm: 'Bạn có chắc muốn xóa ghi chú này?',
  },

  audio: {
    play: 'Phát âm',
    unavailable: 'Chưa có audio',
  },

  notFound: 'Không tìm thấy từ vựng',
  notFoundHint: 'Từ vựng này có thể đã bị xóa hoặc chưa được xuất bản.',
} as const
