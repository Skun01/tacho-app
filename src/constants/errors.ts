import { API_ERROR_MESSAGES } from '@/types/api'

export const DECK_ERROR_MESSAGES: Record<string, string> = {
  Deck_NotFound_404: 'Không tìm thấy bộ thẻ.',
  Deck_FolderNotFound_404: 'Không tìm thấy thư mục trong bộ thẻ.',
  Deck_CardNotFound_404: 'Không tìm thấy thẻ trong thư mục đã chọn.',
  Deck_Forbidden_403: 'Bạn không có quyền truy cập hoặc chỉnh sửa bộ thẻ này.',
  Deck_ForkSourceInvalid_400: 'Bộ thẻ này không thể sao chép vào thư viện cá nhân.',
  Deck_CardDuplicatedInDeck_400: 'Thẻ này đã tồn tại ở thư mục khác trong cùng bộ thẻ.',
  Deck_InvalidReorderPayload_400: 'Dữ liệu sắp xếp không hợp lệ. Vui lòng thử lại.',
  Validation_400: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại.',
  default: 'Không thể xử lý thao tác với bộ thẻ. Vui lòng thử lại.',
}

export const ERROR_MESSAGES = {
  ...API_ERROR_MESSAGES,
  ...DECK_ERROR_MESSAGES,
} as const

