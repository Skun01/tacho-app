export const SETTINGS_COPY = {
  heading: 'Cài đặt',
  tabs: ['Tài khoản', 'Hiển thị', 'Thông báo'] as const,

  account: {
    sectionTitle: 'Thông tin tài khoản',
    displayNameLabel: 'Tên hiển thị',
    displayNamePlaceholder: 'Nhập tên hiển thị...',
    emailLabel: 'Email',
    joinedLabel: 'Ngày tham gia',
    saveNameBtn: 'Lưu tên',
    savedToast: 'Đã cập nhật tên hiển thị',
    changePasswordBtn: 'Đổi mật khẩu',
  },

  password: {
    modalTitle: 'Đổi mật khẩu',
    currentLabel: 'Mật khẩu hiện tại',
    newLabel: 'Mật khẩu mới',
    confirmLabel: 'Xác nhận mật khẩu mới',
    submitBtn: 'Cập nhật',
    cancelBtn: 'Hủy',
    successToast: 'Đã đổi mật khẩu thành công',
    mismatchError: 'Mật khẩu xác nhận không khớp',
    wrongCurrentError: 'Mật khẩu hiện tại không đúng',
  },

  display: {
    sectionTitle: 'Giao diện',
    themeLabel: 'Chủ đề màu sắc',
    themes: [
      { value: 'light',  label: 'Sáng' },
      { value: 'dark',   label: 'Tối' },
      { value: 'system', label: 'Theo thiết bị' },
    ] as const,
  },

  review: {
    sectionTitle: 'Cài đặt tiến trình học',
    dailyNewLabel: 'Thẻ mới mỗi ngày',
    dailyNewDesc: 'Mục tiêu số thẻ bạn muốn hoàn thành mỗi ngày.',
    maxSessionLabel: 'Thẻ tối đa mỗi phiên học',
    maxSessionDesc: 'Áp dụng cho phiên học mới. Phiên ôn sẽ ôn toàn bộ thẻ đến hạn.',
    saveBtn: 'Lưu cài đặt',
    savedToast: 'Đã lưu cài đặt ôn tập',
  },
  notifications: {
    sectionTitle: 'Cài đặt thông báo',
    sectionHint: 'Chọn loại thông báo bạn muốn nhận. Các thay đổi sẽ được áp dụng ngay.',
    savedToast: 'Đã lưu cài đặt thông báo',
    toggles: [
      {
        key: 'reviewReminder',
        label: 'Nhắc ôn tập',
        description: 'Nhận thông báo khi có thẻ đến hạn ôn.',
      },
      {
        key: 'streakWarning',
        label: 'Cảnh báo streak',
        description: 'Nhắc khi bạn sắp mất chuỗi ngày học.',
      },
      {
        key: 'milestone',
        label: 'Thành tích & cột mốc',
        description: 'Khi bạn đạt thành tích mới hoặc thẻ đạt Burned.',
      },
      {
        key: 'social',
        label: 'Xã hội',
        description: 'Trả lời bình luận, lượt thích và clone deck.',
      },
      {
        key: 'system',
        label: 'Hệ thống',
        description: 'Thông báo nội dung mới và cập nhật từ Tacho.',
      },
    ] as const,
  },
} as const

export type SettingsTab = (typeof SETTINGS_COPY.tabs)[number]
