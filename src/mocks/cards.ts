import type { FlashCard, FlashCardWithProgress } from '@/types/card'

export const MOCK_CARDS: FlashCard[] = [
  { id: 'fc1',  type: 'vocab',   jlptLevel: 'N5', content: '私',       reading: 'わたし',    meaning: 'Tôi, ta' },
  { id: 'fc2',  type: 'vocab',   jlptLevel: 'N5', content: '食べる',   reading: 'たべる',    meaning: 'Ăn' },
  { id: 'fc3',  type: 'vocab',   jlptLevel: 'N5', content: '飲む',     reading: 'のむ',      meaning: 'Uống' },
  { id: 'fc4',  type: 'vocab',   jlptLevel: 'N5', content: '学校',     reading: 'がっこう',  meaning: 'Trường học' },
  { id: 'fc5',  type: 'vocab',   jlptLevel: 'N5', content: '友達',     reading: 'ともだち',  meaning: 'Bạn bè' },
  { id: 'fc6',  type: 'vocab',   jlptLevel: 'N5', content: '電車',     reading: 'でんしゃ',  meaning: 'Tàu điện' },
  { id: 'fc7',  type: 'vocab',   jlptLevel: 'N5', content: '図書館',   reading: 'としょかん', meaning: 'Thư viện' },
  { id: 'fc8',  type: 'grammar', jlptLevel: 'N5', content: '〜です／〜ます',      meaning: 'Hình thức lịch sự của động từ và tính từ' },
  { id: 'fc9',  type: 'grammar', jlptLevel: 'N5', content: '〜は〜が好きです',    meaning: '... thích ...' },
  { id: 'fc10', type: 'grammar', jlptLevel: 'N5', content: '〜ください',           meaning: 'Xin hãy làm...' },
  { id: 'fc11', type: 'vocab',   jlptLevel: 'N4', content: '仕事',     reading: 'しごと',    meaning: 'Công việc' },
  { id: 'fc12', type: 'vocab',   jlptLevel: 'N4', content: '会社',     reading: 'かいしゃ',  meaning: 'Công ty' },
  { id: 'fc13', type: 'vocab',   jlptLevel: 'N4', content: '難しい',   reading: 'むずかしい', meaning: 'Khó' },
  { id: 'fc14', type: 'vocab',   jlptLevel: 'N4', content: '勉強',     reading: 'べんきょう', meaning: 'Học bài' },
  { id: 'fc15', type: 'grammar', jlptLevel: 'N4', content: '〜たら',               meaning: 'Điều kiện: nếu... thì...' },
  { id: 'fc16', type: 'grammar', jlptLevel: 'N4', content: '〜なければならない',   meaning: 'Phải làm gì đó (bắt buộc)' },
  { id: 'fc17', type: 'grammar', jlptLevel: 'N4', content: '〜ている',             meaning: 'Đang làm hoặc trạng thái hiện tại' },
  { id: 'fc18', type: 'vocab',   jlptLevel: 'N3', content: '美しい',   reading: 'うつくしい', meaning: 'Đẹp (văn chương)' },
  { id: 'fc19', type: 'vocab',   jlptLevel: 'N3', content: '経験',     reading: 'けいけん',   meaning: 'Kinh nghiệm' },
  { id: 'fc20', type: 'grammar', jlptLevel: 'N3', content: '〜だけでなく',         meaning: 'Không chỉ... mà còn...' },
]

const MOCK_MASTERY: Record<string, number> = {
  fc1: 4, fc2: 3, fc4: 5, fc5: 2,
  fc8: 4, fc11: 1, fc14: 3, fc17: 2,
}

export const MOCK_CARDS_WITH_PROGRESS: FlashCardWithProgress[] = MOCK_CARDS.map((card) => ({
  ...card,
  progress: MOCK_MASTERY[card.id] !== undefined
    ? { cardId: card.id, masteryLevel: MOCK_MASTERY[card.id] }
    : undefined,
}))
