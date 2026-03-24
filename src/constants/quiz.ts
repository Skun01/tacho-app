export const QUIZ_COPY = {
  title: 'Làm bài tập',
  // Question type labels
  typeLabelA: 'Điền vào chỗ trống',
  typeLabelB: 'Nghe và điền',
  typeLabelC: 'Nghe và chọn',
  typeLabelD: 'Thẻ ghi nhớ',
  // Prompts
  promptA: (meaning: string) => `Từ/cấu trúc có nghĩa "${meaning}" là gì?`,
  promptASentence: 'Điền từ còn thiếu vào chỗ trống:',
  promptB: 'Nghe câu ví dụ và gõ lại toàn bộ câu tiếng Nhật:',
  promptC: 'Chọn nghĩa đúng của từ vừa nghe:',
  // Type D flashcard
  flipHint: 'Ấn Space hoặc click để lật thẻ',
  flipRemembered: 'Đã nhớ',
  flipForgot: 'Chưa nhớ',
  flipArrowHint: '← Chưa nhớ · Đã nhớ →',
  // Buttons
  checkBtn: 'Kiểm tra',
  nextBtn: 'Tiếp theo',
  playAudio: 'Phát âm thanh',
  replayAudio: 'Phát lại',
  inputPlaceholder: 'Nhập câu trả lời…',
  // Feedback
  correctLabel: 'Chính xác!',
  wrongLabel: 'Chưa đúng',
  correctAnswerPrefix: 'Đáp án đúng:',
  // Summary
  summaryTitle: 'Kết quả luyện tập',
  summarySubtitle: 'Bạn đã hoàn thành batch học hôm nay!',
  summaryTotal: 'Tổng số thẻ',
  summaryCorrect: 'Trả lời đúng ngay',
  summaryWrong: 'Cần ôn lại',
  summaryAccuracy: 'Tỉ lệ chính xác',
  summaryPromoted: 'Lên bậc',
  summaryDemoted: 'Xuống bậc',
  nextReviewLabel: 'Ôn tập tiếp theo',
  continueBtn: 'Tiếp tục học thẻ mới',
  backDashboard: 'Về trang chủ',
  backStudy: 'Học lại batch này',
}

export type QuizForceType = 'mixed' | 'A' | 'B' | 'C' | 'D'

export const QUIZ_TYPE_OPTIONS: {
  value: QuizForceType
  label: string
  desc: string
  icon: string
}[] = [
  {
    value: 'mixed',
    label: 'Hỗn hợp',
    desc: 'Ngẫu nhiên các dạng bài trong mỗi phiên',
    icon: 'Shuffle',
  },
  {
    value: 'C',
    label: 'Trắc nghiệm',
    desc: 'Chọn 1 trong 4 nghĩa đúng của từ / câu',
    icon: 'ListChecks',
  },
  {
    value: 'A',
    label: 'Điền từ',
    desc: 'Điền từ còn thiếu vào câu ví dụ',
    icon: 'TextT',
  },
  {
    value: 'B',
    label: 'Nghe hiểu',
    desc: 'Nghe câu ví dụ và gõ lại toàn bộ câu',
    icon: 'SpeakerHigh',
  },
  {
    value: 'D',
    label: 'Thẻ ghi nhớ',
    desc: 'Lật thẻ, tự đánh giá mức độ ghi nhớ',
    icon: 'Cards',
  },
]

export const QUIZ_CONFIG_COPY = {
  heading: 'Chọn dạng bài tập',
  subheading: 'Chọn hình thức câu hỏi cho phiên ôn tập này',
  startBtn: 'Bắt đầu ôn tập',
  backLabel: 'Quay lại',
} as const

export const DISTRACTOR_POOL = [
  'Đi lại, di chuyển',
  'Bạn bè, bạn học',
  'Gia đình, người thân',
  'Thời gian, giờ giấc',
  'Công việc, nghề nghiệp',
  'Hôm nay, ngày hôm nay',
  'Ngày mai, tương lai',
  'Buổi sáng, sáng sớm',
  'Đọc sách, đọc báo',
  'Viết thư, ghi chép',
  'Xe đạp, phương tiện',
  'Điện thoại, liên lạc',
  'Nhà hàng, quán ăn',
  'Ga tàu, bến xe',
  'Bệnh viện, phòng khám',
  'Ngân hàng, tài chính',
  'Cảm ơn, biết ơn',
  'Xin chào, chào hỏi',
  'Hình thức phủ định',
  'Điều kiện giả định',
  'Cấu trúc so sánh',
  'Thể hiện ý muốn',
  'Thể hiện khả năng',
  'Biểu đạt lý do, nguyên nhân',
  'Con mèo, thú cưng',
  'Con chó, động vật',
  'Màu xanh, màu sắc',
  'Thể thao, vận động',
  'Âm nhạc, giải trí',
  'Thiên nhiên, môi trường',
]
