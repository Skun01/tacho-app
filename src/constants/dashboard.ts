export const DASHBOARD_NAV = {
  links: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Thư viện', href: '/library' },
    { label: 'Học nhanh', href: '/quick-study' },
  ],
  searchLabel: 'Tìm kiếm',
  notificationsLabel: 'Thông báo',
  logoutLabel: 'Đăng xuất',
  welcomePrefix: 'Xin chào,',
  guestName: 'Người học',
  profileLabel: 'Hồ sơ',
  settingsLabel: 'Cài đặt',
} as const

export const DASHBOARD_QUOTE = {
  label: '✦ Cảm hứng hôm nay',
  text: '"Cố gắng một chút mỗi ngày, vạn dặm cũng sẽ thành gần."',
  kanjiDecor: '学',
} as const

export const DASHBOARD_LEARN = {
  title: 'Bài học hôm nay',
  subtitle: 'Mục tiêu: {n} từ mới',
  ctaLabel: 'Bắt đầu học',
  expandAriaLabel: 'Mở rộng danh sách bộ thẻ',
} as const

export const DASHBOARD_REVIEW = {
  title: 'Cần ôn tập',
  subtitle: 'Nội dung đến hạn học',
  hint: 'Nên ôn tập sớm nhày',
  ctaLabel: 'Làm bài ngay',
  vocabLabel: 'Từ vựng',
  grammarLabel: 'Ngữ pháp',
  expandAriaLabel: 'Mở rộng phân loại ôn tập',
} as const

export const DASHBOARD_PROGRESS = {
  title: 'Tiến độ học',
  tabs: ['Ngữ pháp', 'Từ vựng'] as const,
  levels: [
    { key: 'new', label: 'MỚI HỌC', kanjiDecor: '文' },
    { key: 'learning', label: 'LÀM QUEN', kanjiDecor: '文' },
    { key: 'known', label: 'NẮM VỮNG', kanjiDecor: '文' },
    { key: 'proficient', label: 'THÀNH THẠO', kanjiDecor: '文' },
    { key: 'mastered', label: 'TINH THÔNG', kanjiDecor: '文' },
  ],
} as const

export const DASHBOARD_PERSONAL = {
  title: 'Bảng điều khiển cá nhân',
  activityTitle: 'Hoạt động học tập',
  activityLegendVocab: 'Từ vựng',
  activityLegendGrammar: 'Ngữ pháp',
  streakLabel: 'Chuỗi {n} ngày',
  jlptTitle: 'Thống kê JLPT',
  jlptTabs: ['Từ vựng', 'Ngữ pháp', 'Cả hai'] as const,
  jlptComplete: 'Xong',
} as const
