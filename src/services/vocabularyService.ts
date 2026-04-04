import type { ApiResponse, PaginatedMeta } from '@/types/api'
import type {
  VocabularyCardSummary,
  VocabularyCardDetail,
  VocabularySearchParams,
  UserCardNoteItem,
} from '@/types/vocabulary'
import { MOCK_VOCABULARY_CARDS } from '@/constants/vocabularyMockData'

/**
 * Vocabulary Service — hiện dùng mock data.
 *
 * Khi backend API sẵn sàng, chỉ cần thay:
 *   Promise.resolve(...)  →  api.get('/vocabulary/...')
 *   Promise.resolve(...)  →  api.post('/notes/...')
 */

// ── In-memory mock store cho notes (mutable) ────────────────────────────────
let mockNoteIdCounter = 100

export const vocabularyService = {
  // ─── Search ─────────────────────────────────────────────────────────────────
  async search(
    params: VocabularySearchParams,
  ): Promise<ApiResponse<VocabularyCardSummary[]>> {
    await new Promise((r) => setTimeout(r, 400))

    const query = params.q.toLowerCase().trim()

    let filtered = MOCK_VOCABULARY_CARDS.filter((card) => {
      const matchQuery =
        !query ||
        card.writing.toLowerCase().includes(query) ||
        (card.reading?.toLowerCase().includes(query) ?? false) ||
        card.title.toLowerCase().includes(query) ||
        card.summary.toLowerCase().includes(query) ||
        card.meanings.some((m) =>
          m.definitions.some((d) => d.toLowerCase().includes(query)),
        )

      const matchLevel = !params.level || card.level === params.level
      const matchPos =
        !params.partOfSpeech ||
        card.meanings.some((m) => m.partOfSpeech === params.partOfSpeech)

      return matchQuery && matchLevel && matchPos
    })

    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 20
    const total = filtered.length
    const start = (page - 1) * pageSize
    filtered = filtered.slice(start, start + pageSize)

    const summaries: VocabularyCardSummary[] = filtered.map((card) => ({
      id: card.id,
      cardType: card.cardType,
      title: card.title,
      summary: card.summary,
      level: card.level,
      tags: card.tags,
      status: card.status,
      createdAt: card.createdAt,
      writing: card.writing,
      reading: card.reading,
      wordType: card.wordType,
      meanings: card.meanings,
    }))

    const metaData: PaginatedMeta = { total, page, pageSize }

    return {
      code: 200,
      success: true,
      message: null,
      data: summaries,
      metaData,
    }
  },

  // ─── Detail ─────────────────────────────────────────────────────────────────
  async getDetail(
    id: string,
  ): Promise<ApiResponse<VocabularyCardDetail | null>> {
    await new Promise((r) => setTimeout(r, 300))

    const card = MOCK_VOCABULARY_CARDS.find((c) => c.id === id) ?? null

    if (!card) {
      return {
        code: 404,
        success: false,
        message: 'NotFound_404',
        data: null,
        metaData: null,
      }
    }

    return {
      code: 200,
      success: true,
      message: null,
      data: {
        ...card,
        userNotes: card.userNotes.map((n) => ({ ...n })),
        sentences: card.sentences.map((s) => ({ ...s })),
      },
      metaData: null,
    }
  },

  // ─── Notes CRUD ─────────────────────────────────────────────────────────────

  /**
   * Tạo ghi chú mới.
   * Tương lai: POST /api/cards/:cardId/notes  { content }
   */
  async createNote(
    cardId: string,
    content: string,
  ): Promise<ApiResponse<UserCardNoteItem>> {
    await new Promise((r) => setTimeout(r, 300))

    const newNote: UserCardNoteItem = {
      id: `note-${++mockNoteIdCounter}`,
      userId: 'current-user',
      userName: 'Bạn',
      content,
      likesCount: 0,
      isLikedByMe: false,
      createdAt: new Date().toISOString(),
    }

    // Thêm vào mock data (in-memory)
    const card = MOCK_VOCABULARY_CARDS.find((c) => c.id === cardId)
    if (card) {
      card.userNotes.unshift(newNote)
    }

    return {
      code: 200,
      success: true,
      message: null,
      data: newNote,
      metaData: null,
    }
  },

  /**
   * Xóa ghi chú.
   * Tương lai: DELETE /api/notes/:noteId
   */
  async deleteNote(
    cardId: string,
    noteId: string,
  ): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 200))

    const card = MOCK_VOCABULARY_CARDS.find((c) => c.id === cardId)
    if (card) {
      card.userNotes = card.userNotes.filter((n) => n.id !== noteId)
    }

    return {
      code: 200,
      success: true,
      message: null,
      data: null,
      metaData: null,
    }
  },

  /**
   * Toggle like/unlike ghi chú.
   * Tương lai: POST /api/notes/:noteId/toggle-like
   */
  async toggleNoteLike(
    noteId: string,
  ): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    await new Promise((r) => setTimeout(r, 150))

    // Tìm note trong tất cả cards
    for (const card of MOCK_VOCABULARY_CARDS) {
      const note = card.userNotes.find((n) => n.id === noteId)
      if (note) {
        note.isLikedByMe = !note.isLikedByMe
        note.likesCount += note.isLikedByMe ? 1 : -1

        return {
          code: 200,
          success: true,
          message: null,
          data: { isLiked: note.isLikedByMe, likesCount: note.likesCount },
          metaData: null,
        }
      }
    }

    return {
      code: 404,
      success: false,
      message: 'NotFound_404',
      data: { isLiked: false, likesCount: 0 },
      metaData: null,
    }
  },
}
