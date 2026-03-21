import type { DeckListItem, DeckDetailWithState } from '@/types/deck'
import { MOCK_CARDS } from './cards'

const NOW = '2024-01-01T00:00:00Z'

// ── Studying (Đang học) ───────────────────────────────────────────────────────

export const MOCK_STUDYING_DECKS: DeckListItem[] = [
  {
    id: 's1', name: 'JLPT N5 Từ vựng', description: '', category: 'Từ vựng',
    source: 'app', coverIndex: 0, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 200, vocabCount: 200, grammarCount: 0, userCount: 2400,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: true, isSaved: true, isInReview: true, learnedCards: 52, reviewDue: 8,
  },
  {
    id: 's2', name: 'Genki I – Chapter 1–5', description: '', category: 'Sách giáo khoa',
    source: 'textbook', coverIndex: 1, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 120, vocabCount: 90, grammarCount: 30, userCount: 1100,
    textbook: 'Genki', createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: true, isInReview: true, learnedCards: 30, reviewDue: 0,
  },
  {
    id: 's3', name: 'Ngữ pháp N4', description: '', category: 'Ngữ pháp',
    source: 'app', coverIndex: 3, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 50, vocabCount: 0, grammarCount: 50, userCount: 890,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: true, isInReview: true, learnedCards: 15, reviewDue: 5,
  },
]

// ── My own decks (Cá nhân) ────────────────────────────────────────────────────

export const MOCK_MY_OWN_DECKS: DeckListItem[] = [
  {
    id: 'm1', name: 'Từ vựng anime yêu thích', description: '', category: 'Anime',
    source: 'user', coverIndex: 2, ownerId: 'user-1', ownerName: 'Tôi',
    isPublic: false, totalCards: 45, vocabCount: 45, grammarCount: 0, userCount: 234,
    createdAt: NOW, updatedAt: NOW,
    isOwner: true, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'm2', name: 'Từ vựng công việc', description: '', category: 'Từ vựng',
    source: 'user', coverIndex: 4, ownerId: 'user-1', ownerName: 'Tôi',
    isPublic: false, totalCards: 30, vocabCount: 30, grammarCount: 0, userCount: 110,
    createdAt: NOW, updatedAt: NOW,
    isOwner: true, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
]

// ── Saved decks (Đã lưu) ──────────────────────────────────────────────────────

export const MOCK_SAVED_DECKS: DeckListItem[] = [
  {
    id: 'v1', name: 'JLPT N3 Cộng đồng', description: '', category: 'Từ vựng',
    source: 'community', coverIndex: 1, ownerId: 'tanaka_jp', ownerName: 'tanaka_jp',
    isPublic: true, totalCards: 300, vocabCount: 280, grammarCount: 20, userCount: 5600,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: true, isSaved: true, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'v2', name: 'Minna no Nihongo I – Từ vựng', description: '', category: 'Sách giáo khoa',
    source: 'textbook', coverIndex: 0, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 200, vocabCount: 200, grammarCount: 0, userCount: 3200,
    textbook: 'Minna no Nihongo', createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: true, isSaved: true, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
]

// ── App vocab decks ───────────────────────────────────────────────────────────

export const MOCK_APP_VOCAB_DECKS: DeckListItem[] = [
  {
    id: 'av1', name: 'JLPT N5 Từ vựng – Đầy đủ', description: '', category: 'Từ vựng',
    source: 'app', coverIndex: 0, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 1000, vocabCount: 1000, grammarCount: 0, userCount: 12000,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'av2', name: 'JLPT N4 Từ vựng – Đầy đủ', description: '', category: 'Từ vựng',
    source: 'app', coverIndex: 5, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 1500, vocabCount: 1500, grammarCount: 0, userCount: 8700,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'av3', name: 'JLPT N3 Từ vựng – Đầy đủ', description: '', category: 'Từ vựng',
    source: 'app', coverIndex: 4, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 2000, vocabCount: 2000, grammarCount: 0, userCount: 6200,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
]

// ── App grammar decks ─────────────────────────────────────────────────────────

export const MOCK_APP_GRAMMAR_DECKS: DeckListItem[] = [
  {
    id: 'ag1', name: 'Ngữ pháp JLPT N5', description: '', category: 'Ngữ pháp',
    source: 'app', coverIndex: 3, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 50, vocabCount: 0, grammarCount: 50, userCount: 9400,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'ag2', name: 'Ngữ pháp JLPT N4', description: '', category: 'Ngữ pháp',
    source: 'app', coverIndex: 1, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 80, vocabCount: 0, grammarCount: 80, userCount: 6100,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'ag3', name: 'Ngữ pháp JLPT N3', description: '', category: 'Ngữ pháp',
    source: 'app', coverIndex: 2, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 120, vocabCount: 0, grammarCount: 120, userCount: 4300,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
]

// ── Textbook decks ────────────────────────────────────────────────────────────

export const MOCK_TEXTBOOK_DECKS: DeckListItem[] = [
  {
    id: 'tb1', name: 'Genki I – Bộ thẻ đầy đủ', description: '', category: 'Sách giáo khoa',
    source: 'textbook', coverIndex: 0, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 600, vocabCount: 500, grammarCount: 100, userCount: 15000,
    textbook: 'Genki', createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'tb2', name: 'Genki II – Bộ thẻ đầy đủ', description: '', category: 'Sách giáo khoa',
    source: 'textbook', coverIndex: 5, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 600, vocabCount: 500, grammarCount: 100, userCount: 11000,
    textbook: 'Genki', createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'tb3', name: 'Minna no Nihongo I', description: '', category: 'Sách giáo khoa',
    source: 'textbook', coverIndex: 1, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 500, vocabCount: 400, grammarCount: 100, userCount: 8900,
    textbook: 'Minna no Nihongo', createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'tb4', name: 'Nihongo So-matome N3', description: '', category: 'Sách giáo khoa',
    source: 'textbook', coverIndex: 4, ownerId: 'system', ownerName: 'Biên tập viên Tacho',
    isPublic: true, totalCards: 400, vocabCount: 300, grammarCount: 100, userCount: 4200,
    textbook: 'So-matome', createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
]

// ── Community decks ───────────────────────────────────────────────────────────

export const MOCK_COMMUNITY_DECKS: DeckListItem[] = [
  {
    id: 'c1', name: 'Từ vựng Jujutsu Kaisen', description: '', category: 'Anime',
    source: 'community', coverIndex: 2, ownerId: 'anime_fan99', ownerName: 'anime_fan99',
    isPublic: true, totalCards: 200, vocabCount: 200, grammarCount: 0, userCount: 3400,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'c2', name: 'Slang Nhật hiện đại', description: '', category: 'Từ vựng',
    source: 'community', coverIndex: 4, ownerId: 'nihongo_daily', ownerName: 'nihongo_daily',
    isPublic: true, totalCards: 100, vocabCount: 100, grammarCount: 0, userCount: 2100,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: true, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'c3', name: 'Ngữ pháp N2 nâng cao', description: '', category: 'Ngữ pháp',
    source: 'community', coverIndex: 3, ownerId: 'grammar_master', ownerName: 'grammar_master',
    isPublic: true, totalCards: 150, vocabCount: 0, grammarCount: 150, userCount: 1800,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'c4', name: 'Attack on Titan – Từ vựng', description: '', category: 'Anime',
    source: 'community', coverIndex: 1, ownerId: 'aot_fan', ownerName: 'aot_fan',
    isPublic: true, totalCards: 180, vocabCount: 180, grammarCount: 0, userCount: 2900,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'c5', name: 'Từ vựng J-pop & J-rock', description: '', category: 'Âm nhạc',
    source: 'community', coverIndex: 5, ownerId: 'music_learner', ownerName: 'music_learner',
    isPublic: true, totalCards: 80, vocabCount: 80, grammarCount: 0, userCount: 1200,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
  {
    id: 'c6', name: 'Persona 5 – Vocab Pack', description: '', category: 'Game',
    source: 'community', coverIndex: 0, ownerId: 'gamer_jp', ownerName: 'gamer_jp',
    isPublic: true, totalCards: 250, vocabCount: 250, grammarCount: 0, userCount: 2500,
    createdAt: NOW, updatedAt: NOW,
    isOwner: false, isBookmarked: true, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
]

// ── Deck details (for edit/view pages) ───────────────────────────────────────

export const MOCK_DECK_DETAILS: Record<string, DeckDetailWithState> = {
  me1: {
    id: 'me1', name: 'Từ vựng N5 của tôi',
    description: 'Bộ thẻ từ vựng N5 tôi tự tổng hợp để luyện tập hàng ngày.',
    category: 'Từ vựng', source: 'user', coverIndex: 2,
    ownerId: 'user-1', ownerName: 'Tôi', isPublic: false,
    totalCards: 5, vocabCount: 4, grammarCount: 1, userCount: 1,
    createdAt: NOW, updatedAt: NOW,
    cards: [MOCK_CARDS[0], MOCK_CARDS[1], MOCK_CARDS[4], MOCK_CARDS[7], MOCK_CARDS[3]],
    isOwner: true, isBookmarked: false, isSaved: false, isInReview: true, learnedCards: 3, reviewDue: 2,
  },
  mv1: {
    id: 'mv1', name: 'JLPT N5 Từ vựng – Đầy đủ',
    description: 'Toàn bộ từ vựng cần thiết cho kỳ thi JLPT N5, được biên soạn bởi đội ngũ biên tập Tacho.',
    category: 'Từ vựng', source: 'app', coverIndex: 0,
    ownerId: 'system', ownerName: 'Biên tập viên Tacho', isPublic: true,
    totalCards: 20, vocabCount: 14, grammarCount: 6, userCount: 12000,
    createdAt: NOW, updatedAt: NOW,
    cards: MOCK_CARDS,
    isOwner: false, isBookmarked: false, isSaved: false, isInReview: false, learnedCards: 0, reviewDue: 0,
  },
}
