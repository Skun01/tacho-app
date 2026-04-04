import type { ApiResponse, PaginatedMeta } from '@/types/api'
import type {
  VocabularyCardSummary,
  VocabularyCardDetail,
  VocabularySearchParams,
  UserCardNoteItem,
} from '@/types/vocabulary'
import { MOCK_VOCABULARY_CARDS } from '@/constants/vocabularyMockData'
import api from './api'

/**
 * Vocabulary Service.
 * - Detail + Notes đang dùng backend API thật.
 * - Search tạm thời vẫn dùng mock data cho tới khi backend search sẵn sàng.
 */

export const vocabularyService = {
  // ─── Search
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

  // Detail
  async getDetail(
    id: string,
  ): Promise<ApiResponse<VocabularyCardDetail | null>> {
    try {
      const res = await api.get<ApiResponse<VocabularyCardDetail>>(`/vocabulary/${id}`)
      return res.data
    } catch (error) {
      return {
        code: 404,
        success: false,
        message: (error as Error).message ?? 'Common_404',
        data: null,
        metaData: null,
      }
    }
  },

  // Community Notes (for pagination support)
  async getCommunityNotes(
    cardId: string,
    page = 1,
    pageSize = 10,
  ): Promise<ApiResponse<UserCardNoteItem[]>> {
    try {
      const res = await api.get<ApiResponse<UserCardNoteItem[]>>(`/cards/${cardId}/notes`, {
        params: { page, pageSize },
      })
      return res.data
    } catch (error) {
      return {
        code: 400,
        success: false,
        message: (error as Error).message ?? 'Common_400',
        data: [],
        metaData: null,
      }
    }
  },

  // Notes CRUD

  /** Tạo/cập nhật ghi chú của user hiện tại. */
  async createNote(
    cardId: string,
    content: string,
  ): Promise<ApiResponse<UserCardNoteItem>> {
    try {
      const res = await api.post<ApiResponse<UserCardNoteItem>>(`/cards/${cardId}/notes`, {
        content,
      })
      return res.data
    } catch (error) {
      return {
        code: 400,
        success: false,
        message: (error as Error).message ?? 'Common_400',
        data: {
          id: '',
          userId: '',
          userName: '',
          content: '',
          likesCount: 0,
          isLikedByMe: false,
          createdAt: new Date().toISOString(),
        },
        metaData: null,
      }
    }
  },

  /** Xóa ghi chú của user hiện tại theo cardId. noteId giữ lại để tương thích chữ ký cũ. */
  async deleteNote(
    cardId: string,
    _noteId: string,
  ): Promise<ApiResponse<null>> {
    try {
      const res = await api.delete<ApiResponse<boolean>>(`/cards/${cardId}/notes/me`)
      return {
        ...res.data,
        data: null,
      }
    } catch (error) {
      return {
        code: 400,
        success: false,
        message: (error as Error).message ?? 'Common_400',
        data: null,
        metaData: null,
      }
    }
  },

  /** Toggle like/unlike ghi chú. */
  async toggleNoteLike(
    noteId: string,
  ): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    try {
      const res = await api.post<ApiResponse<{ isLiked: boolean; likesCount: number }>>(
        `/notes/${noteId}/toggle-like`,
      )
      return res.data
    } catch (error) {
      return {
        code: 400,
        success: false,
        message: (error as Error).message ?? 'Common_400',
        data: { isLiked: false, likesCount: 0 },
        metaData: null,
      }
    }
  },
}
