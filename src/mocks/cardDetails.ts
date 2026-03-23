import type { VocabCardDetail, GrammarCardDetail } from '@/types/card'

export const MOCK_VOCAB_DETAILS: Record<string, VocabCardDetail> = {
  fc1: {
    id: 'fc1', type: 'vocab', jlptLevel: 'N5',
    content: '私', reading: 'わたし', meaning: 'Tôi, ta',
    audioUrl: '/audio/watashi.mp3',
    pitchAccent: 'わ↘たし',
    pitchPattern: [1, 0, 0],
    dictionaryEntries: [
      {
        partOfSpeech: 'Đại từ nhân xưng',
        definitions: [
          'Tôi, ta — ngôi thứ nhất, lịch sự, dùng trong hầu hết ngữ cảnh',
          'Bản thân, cá nhân (trong văn viết trang trọng)',
        ],
      },
      {
        partOfSpeech: 'Danh từ',
        definitions: ['Bản thân, cái tôi (triết học, văn học)'],
      },
    ],
    examples: [
      { id: 'ex-fc1-1', japaneseSentence: '私は学生です。', vietnameseMeaning: 'Tôi là học sinh.', jlptLevel: 'N5', audioUrl: '/audio/ex-fc1-1.mp3' },
      { id: 'ex-fc1-2', japaneseSentence: '私の名前は田中です。', vietnameseMeaning: 'Tên tôi là Tanaka.', jlptLevel: 'N5', audioUrl: '/audio/ex-fc1-2.mp3' },
      { id: 'ex-fc1-3', japaneseSentence: '私はコーヒーが好きです。', vietnameseMeaning: 'Tôi thích cà phê.', jlptLevel: 'N5' },
    ],
    userProgress: {
      masteryStage: 4,
      firstLearnedAt: '2025-01-15T08:00:00Z',
      lastReviewedAt: '2025-03-20T14:30:00Z',
      nextReviewAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      reviewCount: 12,
    },
  },
  fc2: {
    id: 'fc2', type: 'vocab', jlptLevel: 'N5',
    content: '食べる', reading: 'たべる', meaning: 'Ăn',
    audioUrl: '/audio/taberu.mp3',
    pitchAccent: 'た↗べ↘る',
    pitchPattern: [0, 1, 0],
    dictionaryEntries: [
      {
        partOfSpeech: 'Động từ nhóm 2 (ichidan)',
        definitions: [
          'Ăn, ăn uống',
          'Sinh sống bằng (ăn bằng công việc) — nghĩa bóng',
        ],
      },
    ],
    examples: [
      { id: 'ex-fc2-1', japaneseSentence: '野菜を食べることが大切です。', vietnameseMeaning: 'Ăn rau củ rất quan trọng.', jlptLevel: 'N5', audioUrl: '/audio/ex-fc2-1.mp3' },
      { id: 'ex-fc2-2', japaneseSentence: '朝ごはんを食べます。', vietnameseMeaning: 'Tôi ăn bữa sáng.', jlptLevel: 'N5', audioUrl: '/audio/ex-fc2-2.mp3' },
      { id: 'ex-fc2-3', japaneseSentence: '何を食べたいですか？', vietnameseMeaning: 'Bạn muốn ăn gì?', jlptLevel: 'N5' },
    ],
    userProgress: {
      masteryStage: 3,
      firstLearnedAt: '2025-01-20T09:00:00Z',
      lastReviewedAt: '2025-03-19T10:00:00Z',
      nextReviewAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      reviewCount: 8,
    },
  },
  fc4: {
    id: 'fc4', type: 'vocab', jlptLevel: 'N5',
    content: '学校', reading: 'がっこう', meaning: 'Trường học',
    pitchAccent: 'が↗っこう',
    pitchPattern: [0, 1, 1, 1],
    dictionaryEntries: [
      {
        partOfSpeech: 'Danh từ',
        definitions: [
          'Trường học (tiểu học, trung học, đại học…)',
          'Cơ sở giáo dục',
        ],
      },
    ],
    examples: [
      { id: 'ex-fc4-1', japaneseSentence: '学校へ行きます。', vietnameseMeaning: 'Tôi đến trường.', jlptLevel: 'N5' },
      { id: 'ex-fc4-2', japaneseSentence: '学校は楽しいですか？', vietnameseMeaning: 'Trường học có vui không?', jlptLevel: 'N5' },
    ],
    userProgress: {
      masteryStage: 14,
      firstLearnedAt: '2024-12-01T07:00:00Z',
      lastReviewedAt: '2025-03-01T08:00:00Z',
      nextReviewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      reviewCount: 31,
    },
  },
}

export const MOCK_GRAMMAR_DETAILS: Record<string, GrammarCardDetail> = {
  fc8: {
    id: 'fc8', type: 'grammar', jlptLevel: 'N5',
    content: '〜です／〜ます',
    meaning: 'Hình thức lịch sự của động từ và tính từ',
    structure: '[Động từ thể ます] / [Danh từ・Tính từ-na] + です',
    formalVariant: '[Động từ thể ます] / [Danh từ・Tính từ-na] + でございます',
    register: 'polite',
    aboutText: `<p>〜です và 〜ます là hai hình thức lịch sự cơ bản nhất trong tiếng Nhật, được gọi là <strong>ていねい語 (teineigo)</strong>.</p>
<p>〜ます dùng ở cuối câu chứa <em>động từ</em>, trong khi 〜です dùng ở cuối câu chứa <em>danh từ hoặc tính từ</em>.</p>
<p>Hai hình thức này phù hợp trong giao tiếp hàng ngày với người lạ, đồng nghiệp, hoặc bất kỳ tình huống nào cần giữ phép lịch sự.</p>`,
    antonyms: [
      { id: 'fc_plain', content: '〜だ／〜る（普通形）', meaning: 'Hình thức thông thường / thân mật' },
    ],
    relatedStructures: [
      { id: 'fc_masende', content: '〜ません', meaning: 'Phủ định lịch sự của ます' },
      { id: 'fc_mashita', content: '〜ました', meaning: 'Quá khứ lịch sự của ます' },
    ],
    references: [
      { id: 'ref1', title: 'Genki I — Chapter 3: Verbs', url: 'https://genki.japantimes.co.jp' },
    ],
    aboutExamples: [
      { id: 'about-fc8-1', japaneseSentence: '先生です。', vietnameseMeaning: '(Tôi) là giáo viên. — Danh từ + です', jlptLevel: 'N5' },
      { id: 'about-fc8-2', japaneseSentence: '食べます。', vietnameseMeaning: '(Tôi) ăn. — Động từ thể ます', jlptLevel: 'N5' },
    ],
    examples: [
      { id: 'ex-fc8-1', japaneseSentence: '田中さんは先生です。', vietnameseMeaning: 'Anh Tanaka là giáo viên.', jlptLevel: 'N5' },
      { id: 'ex-fc8-2', japaneseSentence: '毎日勉強します。', vietnameseMeaning: 'Tôi học mỗi ngày.', jlptLevel: 'N5' },
      { id: 'ex-fc8-3', japaneseSentence: 'このケーキはおいしいです。', vietnameseMeaning: 'Chiếc bánh này ngon.', jlptLevel: 'N5' },
    ],
    userProgress: {
      masteryStage: 7,
      firstLearnedAt: '2025-01-10T07:00:00Z',
      lastReviewedAt: '2025-03-21T09:00:00Z',
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      reviewCount: 20,
    },
  },
  fc15: {
    id: 'fc15', type: 'grammar', jlptLevel: 'N4',
    content: '〜たら',
    meaning: 'Điều kiện: nếu... thì...',
    structure: '[Động từ thể た] + ら / [Danh từ・Tính từ] + だったら',
    formalVariant: undefined,
    register: 'standard',
    aboutText: `<p>〜たら diễn đạt điều kiện, có thể mang nghĩa <strong>"nếu/khi A thì B"</strong>.</p>
<p>Khác với 〜ば hay 〜と, 〜たら được dùng tự nhiên hơn trong văn nói và có thể kèm theo <em>kết quả bất ngờ</em> hoặc <em>khám phá</em>.</p>`,
    antonyms: [],
    relatedStructures: [
      { id: 'fc_ba', content: '〜ば', meaning: 'Điều kiện thuần túy, mang tính logic cao hơn' },
      { id: 'fc_to', content: '〜と', meaning: 'Điều kiện tự nhiên / quy luật tất yếu' },
    ],
    references: [
      { id: 'ref2', title: 'Minna no Nihongo II — Bài 25', url: '#' },
    ],
    examples: [
      { id: 'ex-fc15-1', japaneseSentence: '家に帰ったら、電話してください。', vietnameseMeaning: 'Khi về nhà, hãy gọi điện cho tôi.', jlptLevel: 'N4' },
      { id: 'ex-fc15-2', japaneseSentence: '雨だったら、行きません。', vietnameseMeaning: 'Nếu trời mưa, tôi sẽ không đi.', jlptLevel: 'N4' },
    ],
  },
}
