import type { VocabularyCardDetail } from '@/types/vocabulary'

/**
 * Mock data đầy đủ — bao phủ nhiều trường hợp:
 *
 * - Đủ JLPT level (N5, N4, N3)
 * - Đủ WordType (Native, SinoJapanese, Loanword)
 * - Đủ PartOfSpeech (Noun, VerbU, VerbRu, IAdj, NaAdj, Adverb)
 * - Từ có nhiều nghĩa (multiple meanings / multiple PartOfSpeech)
 * - Từ có / không có synonyms, antonyms, relatedPhrases
 * - Từ có / không có sentences
 * - Từ có / không có userNotes
 * - Từ có / không có pitchAccent, audioUrl
 * - Từ có / không có tags
 */
export const MOCK_VOCABULARY_CARDS: VocabularyCardDetail[] = [
  // 1. 食べる — Động từ nhóm II, N5, Native
  {
    id: 'card-001',
    cardType: 'Vocab',
    title: '食べる',
    summary: 'Ăn',
    level: 'N5',
    tags: ['động từ', 'hàng ngày', 'ẩm thực'],
    status: 'Published',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z',
    writing: '食べる',
    reading: 'たべる',
    pitchPattern: [0, 1, 1],
    audioUrl: "neddddull",
    wordType: 'Native',
    meanings: [
      {
        partOfSpeech: 'VerbRu',
        definitions: ['Ăn', 'Dùng bữa', 'Ăn uống'],
      },
    ],
    synonyms: ['召し上がる', '頂く'],
    antonyms: ['召し上がる'],
    relatedPhrases: ['食べ物', '食べ放題', '食べ過ぎる'],
    sentences: [
      {
        id: 'sent-001',
        text: '毎日、朝ごはんを食べます。',
        meaning: 'Tôi ăn sáng mỗi ngày.',
        audioUrl: 'nufdsfll',
        level: 'N5',
      },
      {
        id: 'sent-002',
        text: '日本料理を食べたことがありますか。',
        meaning: 'Bạn đã từng ăn món Nhật chưa?',
        audioUrl: 'nsdfdull',
        level: 'N4',
      },
    ],
    userNotes: [
      {
        id: 'note-001',
        userId: 'user-001',
        userName: 'Minh Anh',
        content: 'Nhớ phân biệt: 食べる (taberu) là nhóm II, còn 食う (kuu) là nhóm I và thô hơn.',
        likesCount: 12,
        isLikedByMe: false,
        createdAt: '2026-02-20T10:00:00Z',
      },
    ],
  },

  // 2. 飲む — Động từ nhóm I, N5, Native
  {
    id: 'card-002',
    cardType: 'Vocab',
    title: '飲む',
    summary: 'Uống',
    level: 'N5',
    tags: ['động từ', 'hàng ngày'],
    status: 'Published',
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: null,
    writing: '飲む',
    reading: 'のむ',
    pitchPattern: [1, 0],
    audioUrl: null,
    wordType: 'Native',
    meanings: [
      {
        partOfSpeech: 'VerbU',
        definitions: ['Uống', 'Nuốt'],
      },
    ],
    synonyms: [],
    antonyms: [],
    relatedPhrases: ['飲み物', '飲み会', '飲み放題'],
    sentences: [
      {
        id: 'sent-003',
        text: 'お茶を飲みませんか。',
        meaning: 'Bạn uống trà không?',
        audioUrl: null,
        level: 'N5',
      },
    ],
    userNotes: [],
  },

  // 3. 学校 — Danh từ, N5, SinoJapanese
  {
    id: 'card-003',
    cardType: 'Vocab',
    title: '学校',
    summary: 'Trường học',
    level: 'N5',
    tags: ['danh từ', 'giáo dục', 'cơ bản'],
    status: 'Published',
    createdAt: '2026-01-16T09:00:00Z',
    updatedAt: '2026-02-01T15:00:00Z',
    writing: '学校',
    reading: 'がっこう',
    pitchPattern: [0, 1, 1, 0],
    audioUrl: null,
    wordType: 'SinoJapanese',
    meanings: [
      {
        partOfSpeech: 'Noun',
        definitions: ['Trường học', 'Trường'],
      },
    ],
    synonyms: ['学院', '学園'],
    antonyms: [],
    relatedPhrases: ['小学校', '中学校', '高校', '大学'],
    sentences: [
      {
        id: 'sent-004',
        text: '学校は8時に始まります。',
        meaning: 'Trường học bắt đầu lúc 8 giờ.',
        audioUrl: null,
        level: 'N5',
      },
      {
        id: 'sent-005',
        text: '学校まで歩いて10分かかります。',
        meaning: 'Từ đây đi bộ đến trường mất 10 phút.',
        audioUrl: null,
        level: 'N4',
      },
    ],
    userNotes: [
      {
        id: 'note-002',
        userId: 'user-002',
        userName: 'Hoàng Long',
        content: '学 = học, 校 = trường. Đây là từ Hán-Việt rất dễ nhớ!',
        likesCount: 8,
        isLikedByMe: true,
        createdAt: '2026-03-01T14:00:00Z',
      },
      {
        id: 'note-003',
        userId: 'user-003',
        userName: 'Thu Hà',
        content: 'Cách phát âm: がっ có ngắt âm (っ), đừng đọc là がこう.',
        likesCount: 5,
        isLikedByMe: false,
        createdAt: '2026-03-05T09:30:00Z',
      },
    ],
  },

  // ── 4. 大きい — Tính từ -i, N5, Native, không có synonyms ────────────────
  {
    id: 'card-004',
    cardType: 'Vocab',
    title: '大きい',
    summary: 'To, lớn',
    level: 'N5',
    tags: ['tính từ', 'kích thước', 'cơ bản'],
    status: 'Published',
    createdAt: '2026-01-17T10:00:00Z',
    updatedAt: null,
    writing: '大きい',
    reading: 'おおきい',
    pitchPattern: [0, 1, 1, 0],
    audioUrl: null,
    wordType: 'Native',
    meanings: [
      {
        partOfSpeech: 'IAdj',
        definitions: ['To', 'Lớn', 'Rộng lớn'],
      },
    ],
    synonyms: ['巨大な', 'でかい'],
    antonyms: ['小さい'],
    relatedPhrases: ['大きさ', '大きく'],
    sentences: [
      {
        id: 'sent-006',
        text: 'この犬は大きいですね。',
        meaning: 'Con chó này to nhỉ.',
        audioUrl: null,
        level: 'N5',
      },
    ],
    userNotes: [],
  },

  // ── 5. きれい — Tính từ -na, N5, Native, CÓ nhiều nghĩa ──────────────────
  {
    id: 'card-005',
    cardType: 'Vocab',
    title: 'きれい',
    summary: 'Đẹp, sạch sẽ',
    level: 'N5',
    tags: ['tính từ', 'mô tả', 'thường dùng'],
    status: 'Published',
    createdAt: '2026-01-18T11:00:00Z',
    updatedAt: '2026-02-15T08:00:00Z',
    writing: 'きれい',
    reading: 'きれい',
    pitchPattern: null,
    audioUrl: null,
    wordType: null,
    meanings: [
      {
        partOfSpeech: 'NaAdj',
        definitions: ['Đẹp', 'Xinh đẹp', 'Tuyệt đẹp'],
      },
      {
        partOfSpeech: 'NaAdj',
        definitions: ['Sạch sẽ', 'Ngăn nắp', 'Gọn gàng'],
      },
    ],
    synonyms: ['美しい', '素敵な'],
    antonyms: ['汚い', '醜い'],
    relatedPhrases: ['きれいに', 'きれいな人'],
    sentences: [
      {
        id: 'sent-007',
        text: 'この花はきれいです。',
        meaning: 'Bông hoa này đẹp.',
        audioUrl: null,
        level: 'N5',
      },
      {
        id: 'sent-008',
        text: '部屋をきれいにしてください。',
        meaning: 'Hãy dọn phòng cho sạch.',
        audioUrl: null,
        level: 'N4',
      },
    ],
    userNotes: [],
  },

  // ── 6. 友達 — Danh từ, N5, SinoJapanese + Native ─────────────────────────
  {
    id: 'card-006',
    cardType: 'Vocab',
    title: '友達',
    summary: 'Bạn bè',
    level: 'N5',
    tags: ['danh từ', 'quan hệ', 'cơ bản'],
    status: 'Published',
    createdAt: '2026-01-19T12:00:00Z',
    updatedAt: null,
    writing: '友達',
    reading: 'ともだち',
    pitchPattern: [0, 1, 1, 0],
    audioUrl: null,
    wordType: 'Native',
    meanings: [
      {
        partOfSpeech: 'Noun',
        definitions: ['Bạn bè', 'Bạn', 'Người bạn'],
      },
    ],
    synonyms: ['仲間', '友人'],
    antonyms: ['敵'],
    relatedPhrases: ['友達になる', '親友'],
    sentences: [
      {
        id: 'sent-009',
        text: '友達と映画を見ました。',
        meaning: 'Tôi đã xem phim cùng bạn.',
        audioUrl: null,
        level: 'N5',
      },
    ],
    userNotes: [],
  },

  // ── 7. コンピューター — Danh từ, N4, Loanword, không sentences ────────────
  {
    id: 'card-007',
    cardType: 'Vocab',
    title: 'コンピューター',
    summary: 'Máy tính',
    level: 'N4',
    tags: ['danh từ', 'công nghệ', 'ngoại lai'],
    status: 'Published',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: null,
    writing: 'コンピューター',
    reading: 'コンピューター',
    pitchPattern: null,
    audioUrl: null,
    wordType: 'Loanword',
    meanings: [
      {
        partOfSpeech: 'Noun',
        definitions: ['Máy tính', 'Máy vi tính', 'Computer'],
      },
    ],
    synonyms: ['パソコン', '電子計算機'],
    antonyms: [],
    relatedPhrases: ['コンピューターゲーム'],
    sentences: [],
    userNotes: [],
  },

  // ── 8. 勉強する — Động từ nhóm III (する), N5, SinoJapanese ──────────────
  {
    id: 'card-008',
    cardType: 'Vocab',
    title: '勉強する',
    summary: 'Học, học bài',
    level: 'N5',
    tags: ['động từ', 'giáo dục', 'する動詞'],
    status: 'Published',
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
    writing: '勉強する',
    reading: 'べんきょうする',
    pitchPattern: [0, 1, 1, 0, 0, 0],
    audioUrl: null,
    wordType: 'SinoJapanese',
    meanings: [
      {
        partOfSpeech: 'VerbRu',
        definitions: ['Học', 'Học bài', 'Nghiên cứu'],
      },
    ],
    synonyms: ['学ぶ', '習う'],
    antonyms: ['遊ぶ', 'サボる'],
    relatedPhrases: ['勉強家', '勉強中', '勉強になる'],
    sentences: [
      {
        id: 'sent-010',
        text: '毎日、日本語を勉強しています。',
        meaning: 'Hàng ngày tôi đều học tiếng Nhật.',
        audioUrl: null,
        level: 'N5',
      },
      {
        id: 'sent-011',
        text: 'もっと勉強しなければなりません。',
        meaning: 'Tôi phải học nhiều hơn nữa.',
        audioUrl: null,
        level: 'N3',
      },
    ],
    userNotes: [
      {
        id: 'note-004',
        userId: 'user-004',
        userName: 'Quốc Bảo',
        content: '勉強 (benkyou) gồm 勉 (cố gắng) + 強 (mạnh). Học = cố gắng cho mạnh lên!',
        likesCount: 20,
        isLikedByMe: true,
        createdAt: '2026-02-10T16:00:00Z',
      },
    ],
  },

  // ── 9. ゆっくり — Phó từ, N5, Native, không synonyms/antonyms ─────────────
  {
    id: 'card-009',
    cardType: 'Vocab',
    title: 'ゆっくり',
    summary: 'Chậm rãi, từ từ',
    level: 'N5',
    tags: ['phó từ', 'tốc độ', 'thường dùng'],
    status: 'Published',
    createdAt: '2026-01-21T14:00:00Z',
    updatedAt: null,
    writing: 'ゆっくり',
    reading: 'ゆっくり',
    pitchPattern: null,
    audioUrl: null,
    wordType: 'Native',
    meanings: [
      {
        partOfSpeech: 'Adverb',
        definitions: ['Chậm rãi', 'Từ từ', 'Thong thả'],
      },
    ],
    synonyms: [],
    antonyms: [],
    relatedPhrases: ['ゆっくりする', 'ゆっくり休む'],
    sentences: [
      {
        id: 'sent-012',
        text: 'ゆっくり話してください。',
        meaning: 'Xin hãy nói chậm lại.',
        audioUrl: null,
        level: 'N5',
      },
    ],
    userNotes: [],
  },

  // ── 10. 経験 — Danh từ, N3, SinoJapanese (higher level) ──────────────────
  {
    id: 'card-010',
    cardType: 'Vocab',
    title: '経験',
    summary: 'Kinh nghiệm, trải nghiệm',
    level: 'N3',
    tags: ['danh từ', 'công việc', 'trừu tượng'],
    status: 'Published',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: null,
    writing: '経験',
    reading: 'けいけん',
    pitchPattern: [0, 1, 1, 0],
    audioUrl: "jfalsdfjlsadjflsdk",
    wordType: 'SinoJapanese',
    meanings: [
      {
        partOfSpeech: 'Noun',
        definitions: ['Kinh nghiệm', 'Trải nghiệm', 'Sự trải qua'],
      },
      {
        partOfSpeech: 'VerbRu',
        definitions: ['Trải nghiệm', 'Kinh qua (経験する)'],
      },
    ],
    synonyms: ['体験'],
    antonyms: [],
    relatedPhrases: ['経験する', '経験者', '経験を積む', '経験豊富'],
    sentences: [
      {
        id: 'sent-013',
        text: 'いい経験になりました。',
        meaning: 'Đó là một trải nghiệm tốt.',
        audioUrl: "ádlfasldfjlasdjfklasjkldfjsd",
        level: 'N3',
      },
      {
        id: 'sent-014',
        text: '仕事の経験がありますか。',
        meaning: 'Bạn có kinh nghiệm làm việc không?',
        audioUrl: null,
        level: 'N3',
      },
    ],
    userNotes: [
      {
        id: 'note-005',
        userId: 'user-005',
        userName: 'Lan Phương',
        content: 'Kinh (経) + Nghiệm (験). Từ Hán-Việt giống hệt! Dễ nhớ lắm.',
        likesCount: 15,
        isLikedByMe: false,
        createdAt: '2026-03-15T11:00:00Z',
      },
    ],
  },
]
