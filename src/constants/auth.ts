export const AUTH_LOGIN_COPY = {
  heading: 'Chào mừng trở lại',
  subheading: 'Đăng nhập để tiếp tục hành trình của bạn.',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Mật khẩu',
  passwordPlaceholder: '••••••••',
  submitButton: 'Đăng nhập',
  loadingButton: 'Đang đăng nhập...',
  registerPrompt: 'Chưa có tài khoản?',
  registerLink: 'Đăng ký',
  forgotPassword: 'Quên mật khẩu?',
} as const

export const AUTH_REGISTER_COPY = {
  heading: 'Tạo tài khoản',
  subheading: 'Bắt đầu hành trình học tiếng Nhật của bạn.',
  displayNameLabel: 'Tên hiển thị',
  displayNamePlaceholder: 'Nguyễn Văn A',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Mật khẩu',
  passwordPlaceholder: '••••••••',
  submitButton: 'Đăng ký',
  loadingButton: 'Đang tạo tài khoản...',
  loginPrompt: 'Đã có tài khoản?',
  loginLink: 'Đăng nhập',
} as const

export const AUTH_FORGOT_PASSWORD_COPY = {
  heading: 'Quên mật khẩu?',
  subheading: 'Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  submitButton: 'Gửi link đặt lại',
  loadingButton: 'Đang gửi...',
  backToLogin: 'Quay lại đăng nhập',
  successHeading: 'Kiểm tra hộp thư của bạn',
  successMessage:
    'Chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hòm thư đến (và thư mục spam).',
  successAction: 'Quay lại đăng nhập',
} as const

export const AUTH_RESET_PASSWORD_COPY = {
  heading: 'Đặt lại mật khẩu',
  subheading: 'Tạo mật khẩu mới cho tài khoản của bạn.',
  newPasswordLabel: 'Mật khẩu mới',
  newPasswordPlaceholder: '••••••••',
  confirmPasswordLabel: 'Xác nhận mật khẩu',
  confirmPasswordPlaceholder: '••••••••',
  submitButton: 'Đặt lại mật khẩu',
  loadingButton: 'Đang xử lý...',
  successToast: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.',
} as const

export const AUTH_PROFILE_COPY = {
  profileSection: 'Thông tin tài khoản',
  displayNameLabel: 'Tên hiển thị',
  displayNamePlaceholder: 'Nguyễn Văn A',
  avatarUrlLabel: 'Ảnh đại diện (URL)',
  avatarUrlPlaceholder: 'https://...',
  saveProfileButton: 'Lưu thay đổi',
  savingProfileButton: 'Đang lưu...',
  saveProfileSuccess: 'Thông tin đã được cập nhật.',
  securitySection: 'Bảo mật',
  currentPasswordLabel: 'Mật khẩu hiện tại',
  newPasswordLabel: 'Mật khẩu mới',
  confirmNewPasswordLabel: 'Xác nhận mật khẩu mới',
  changePasswordButton: 'Đổi mật khẩu',
  changingPasswordButton: 'Đang xử lý...',
  changePasswordSuccess: 'Mật khẩu đã được thay đổi thành công.',
} as const

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Invalid_Credentials: 'Email hoặc mật khẩu không đúng.',
  Email_Exist_409: 'Email này đã được sử dụng.',
  User_NotFound_404: 'Không tìm thấy tài khoản với email này.',
  Invalid_Token_400: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
  Wrong_Current_Password: 'Mật khẩu hiện tại không đúng.',
  Validation_400: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  default: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
}
