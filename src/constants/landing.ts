// ─── Landing Page Constants ────────────────────────────────────────────────
// All static copy for the landing page — components should only render these.

export const LANDING_NAV = {
  brand: 'Tacho',
  kanjiBrand: '太',
  links: [
    { label: 'Giới thiệu', href: '#gioi-thieu' },
    { label: 'Kho tri thức', href: '#kho-tri-thuc' },
    { label: 'Về tôi', href: '#ve-toi' },
  ],
  ctaLogin: 'Đăng nhập',
  ctaRegister: 'Bắt đầu học',
} as const

export const LANDING_HERO = {
  anchor: 'gioi-thieu',
  sectionLabel: '学ぶ',
  headline: 'Học tiếng Nhật\ndễ như đấu vật',
  description:
    'Tacho là một ứng dụng đưa bạn vào hành trình khám phá ngôn ngữ. Tra cứu dễ dàng, tự tạo bộ thẻ ghi nhớ và ôn luyện qua từng nét chữ, âm thanh, ví dụ — không vội vã, không áp lực.',
  cta: 'Tham gia ngay',
  bgImageNote: 'tree_mountain.jpg',
} as const

export const LANDING_KNOWLEDGE = {
  anchor: 'kho-tri-thuc',
  sectionLabel: '知識',
  heading: 'Kho tri thức',
  cards: [
    {
      kanji: '辞',
      title: 'Từ điển toàn diện',
      description:
        'Tra cứu từ vựng, ngữ pháp, và kanji với đầy đủ thông tin: nghĩa, cách đọc, loại từ, ngữ cảnh sử dụng và ví dụ đi kèm.',
      previewType: 'none' as const,
    },
    {
      kanji: '束',
      title: 'Tự tạo bộ thẻ của bạn',
      description:
        'Tạo và quản lý các bộ thẻ (deck) theo chủ đề: từ vựng, ngữ pháp, kanji. Phân loại theo thể loại, cấp độ hoặc mục tiêu học.',
      previewType: 'chips' as const,
      chips: ['JLPT N5', 'Kanji thông dụng', 'Ngữ pháp hội thoại'],
    },
    {
      kanji: '声',
      title: 'Ví dụ thực tế, có âm thanh',
      description:
        'Mỗi từ và mẫu ngữ pháp đều đi kèm câu ví dụ thực tế, bản dịch tiếng Việt và audio phát âm chuẩn.',
      previewType: 'example' as const,
      exampleJP: '毎日少しずつ練習すれば、必ず上手になります。',
      exampleVI: 'Nếu luyện tập một chút mỗi ngày, bạn chắc chắn sẽ tiến bộ.',
    },
  ],
} as const

export const LANDING_ABOUT = {
  anchor: 've-toi',
  sectionLabel: '私',
  heading: 'Về tôi',
  name: 'Thái Trường',
  role: 'Developer',
  story: 'Mình làm ra website này chỉ với một mong muốn nho nhỏ, đó là có thể tự mình thực hiện được một website hữu ích, dùng được hết các kiến thức mà mình đã học trong 4 năm đại học chuyên ngành công nghệ thông tin.',
  storyPlaceholder:
    'Mình làm ra website này chỉ với một mong muốn nho nhỏ, đó là làm được một cái gì đấy có ích cho đời',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Skun01', icon: 'github' as const },
    { label: 'Facebook', href: 'https://www.facebook.com/truong.thaivan.714', icon: 'facebook' as const },
  ],
} as const

export const LANDING_FOOTER = {
  brand: 'Tacho',
  kanjiBrand: '太',
  description:
    'Tacho là không gian học tiếng Nhật gọn gàng, dễ tra cứu và đủ gần gũi để bạn muốn quay lại mỗi ngày.',
  columns: [
    {
      heading: 'Khám phá',
      links: [
        { label: 'Giới thiệu', href: '#gioi-thieu' },
        { label: 'Kho tri thức', href: '#kho-tri-thuc' },
        { label: 'Về tôi', href: '#ve-toi' },
      ],
    },
    {
      heading: 'Điều hướng',
      links: [
        { label: 'Đăng nhập', href: '/login' },
        { label: 'Tạo tài khoản', href: '/register' },
        { label: 'Dashboard', href: '/dashboard' },
      ],
    },
  ],
  copyright: '© 2026 Tacho. All rights reserved.',
} as const
