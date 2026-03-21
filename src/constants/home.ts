export const HOME_HERO = {
  kanjiBadge: '漢',
  badgeLabel: 'Khai trí thức mới',
  headline: 'Học tiếng Nhật theo cách của người Nhật',
  subheadline:
    'Tacho đưa bạn vào hành trình khám phá ngôn ngữ qua từng nét chữ, âm thanh và văn hóa — không vội vã, không lo lắng.',
  ctaPrimary: 'Bắt đầu miễn phí',
} as const

export const HOME_NAV = {
  links: [
    { label: 'Giới thiệu', href: '#introduction' },
    { label: 'Kho tri thức', href: '#knowledge' },
    { label: 'Chức năng', href: '#features' },
    { label: 'Cảm nhận', href: '#feels' },
    { label: 'Về tôi', href: '#about' },
  ],
  loginLabel: 'Đăng nhập',
  registerLabel: 'Tham gia',
} as const

export const HOME_FEATURES = {
  heading: 'Khám phá kho tri thức',
  cards: [
    {
      kanji: '文',
      label: null,
      title: 'Ngữ pháp N5–N1',
      description:
        'Hệ thống ngữ pháp được sắp xếp đầy đủ, giúp bạn tiến từ sơ cấp đến cao cấp một cách có cấu trúc.',
      featured: false,
    },
    {
      kanji: '語',
      label: 'CHỌN ĐỌC',
      title: 'Từ vựng theo bộ thẻ',
      description:
        'Học từ vựng qua các bộ thẻ đa dạng',
      featured: true,
    },
    {
      kanji: '聞',
      label: null,
      title: 'Học qua ví dụ',
      description:
        'Học qua các ví dụ thực tế giúp bạn hiểu cách sử dụng từ vựng và ngữ pháp trong ngữ cảnh.',
      featured: false,
    },
  ],
} as const

export const HOME_HOW_IT_WORKS = {
  sectionLabel: 'Cách hoạt động',
  heading: 'Ba bước đến sự thành thạo',
  steps: [
    {
      step: '01',
      title: 'Chọn lộ trình',
      description: 'Làm bài kiểm tra đầu vào ngắn để Tacho hiểu bạn đang ở đâu.',
    },
    {
      step: '02',
      title: 'Học theo từng bài',
      description: 'Các bài học ngắn — 10 phút mỗi ngày — được thiết kế cho cuộc sống bận rộn.',
    },
    {
      step: '03',
      title: 'Ôn tập thông minh',
      description: 'Thuật toán lặp lại có khoảng cách giúp bạn nhớ mà không cần học vẹt.',
    },
  ],
} as const

export const HOME_WHY = {
  heading: 'Các tính năng của Tacho',
  items: [
    {
      title: 'Hoàn toàn miễn phí',
      description:
        'Chúng tôi tin rằng việc học không nên có rào cản về tiền bạc. Mọi tài liệu đều mở cửa cho tất cả mọi người.',
    },
    {
      title: 'Nội dung tinh tuyển',
      description:
        'Tất cả bài học được kiểm tra và cải thiện bởi giáo viên bản ngữ và chuyên gia ngôn ngữ học.',
    },
    {
      title: 'Học tập cộng đồng',
      description:
        'Không học một mình. Tacho kết nối bạn với hàng ngàn người đang học tiếng Nhật trên khắp Việt Nam.',
    },
  ],
} as const

export const HOME_TESTIMONIALS = {
  heading: 'Cảm nhận người học',
  items: [
    {
      quote:
        '"Tôi thử Tacho khi thấy app mọi người hay dùng. Bây giờ tôi tự học được bài thi N3 mà không cần gia sư nữa."',
      name: 'Minh Anh',
      role: 'Thành viên từ 2023',
      avatar: 'MA',
    },
    {
      quote:
        '"Giao diện rất dễ và thấm sâu vào người học. Tacho khiến tôi muốn mở app mỗi ngày mà không cảm thấy bị ép buộc."',
      name: 'Quốc Bảo',
      role: 'Thành viên từ cộng đồng',
      avatar: 'QB',
    },
  ],
} as const

export const HOME_CTA = {
  heading: 'Về mình',
  subheading:
    'Chúng tôi là một nhóm những người yêu tiếng Nhật, xây dựng Tacho để ai cũng có thể tiếp cận ngôn ngữ này một cách tự nhiên và bền vững.',
  emailPlaceholder: 'Email của bạn...',
  button: 'Tham gia',
  kanjiDecor: '大',
} as const

export const HOME_FOOTER = {
  brand: 'Tacho',
  description: 'Nền tảng học tiếng Nhật miễn phí, được xây dựng bởi cộng đồng.',
  copyright: '© 2025 Tacho. Học tiếng Nhật, theo cách của bạn.',
  columns: [
    {
      heading: 'Khám phá',
      links: [
        { label: 'Ngữ pháp', href: '#' },
        { label: 'Từ vựng', href: '#' },
        { label: 'Cộng đồng', href: '#' },
      ],
    },
    {
      heading: 'Hỗ trợ',
      links: [
        { label: 'Liên hệ', href: '#' },
        { label: 'Điều khoản', href: '#' },
        { label: 'Bảo mật', href: '#' },
      ],
    },
  ],
} as const
