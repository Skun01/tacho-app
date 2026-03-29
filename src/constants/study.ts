export const STUDY_COPY = {
  title: 'Học thẻ',
  exitLabel: 'Thoát',
  cardCounter: (i: number, total: number) => `${i} / ${total} thẻ`,
  cardCounterLoading: '…',

  prevBtn: 'Trước',
  nextBtn: 'Tiếp',
  startQuizBtn: 'Bắt đầu bài tập',

  cardPosition: (i: number, total: number) => `Thẻ ${i} / ${total}`,
  cardPositionLoading: 'Thẻ …',

  notFound: 'Không tìm thấy thẻ.',
} as const
