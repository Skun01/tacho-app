import type { Notification } from '@/types/notification'

/**
 * Mock notifications cho giai đoạn dev (chưa có backend).
 * TODO: xóa file này khi đã integrate GET /notifications.
 */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'review_reminder',
    title: 'Bạn có 34 thẻ cần ôn hôm nay',
    body: 'Đừng bỏ lỡ — ôn tập ngay để giữ đà học!',
    data: { dueCount: 34 },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'n2',
    type: 'comment_reply',
    title: 'Trần B đã trả lời bình luận của bạn',
    body: '"Mình cũng hay nhầm hai từ này với nhau!"',
    data: { cardId: 'c1', cardContent: '学校', commentId: 'cm1', replyAuthor: 'Trần B' },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'n3',
    type: 'milestone',
    title: 'Bạn vừa học được 100 thẻ!',
    body: 'Thành tích tuyệt vời. Tiếp tục giữ vững phong độ nhé 🎉',
    data: { milestoneType: 'cards_100', value: 100 },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'n4',
    type: 'streak_warning',
    title: 'Giữ streak 7 ngày của bạn!',
    body: 'Bạn chưa học hôm nay. Học 1 thẻ ngay để không mất chuỗi.',
    data: { streakDays: 7 },
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: 'n5',
    type: 'card_burned',
    title: '学校 vừa đạt Burned!',
    body: 'Thẻ này đã đạt mức thành thạo cao nhất. Xuất sắc!',
    data: { cardId: 'c5', cardContent: '学校' },
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'n6',
    type: 'deck_cloned',
    title: 'Ai đó vừa clone deck N5 của bạn',
    body: 'Deck "N5 từ vựng cơ bản" của bạn đang được nhiều người học!',
    data: { deckId: 'd1', deckName: 'N5 từ vựng cơ bản' },
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'n7',
    type: 'system',
    title: 'Tacho vừa thêm 50 thẻ N3 mới',
    body: 'Kho từ vựng và ngữ pháp N3 vừa được cập nhật. Khám phá ngay!',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
]
