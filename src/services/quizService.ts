import type { QuizQuestion } from '@/types/quiz'
import type { QuizForceType } from '@/constants/quiz'
import { MOCK_QUIZ_BANK } from '@/mocks/quizBatch'
import type { ApiResponse } from '@/types/api'
import api from './api'

export interface QuizBatch {
  questions: QuizQuestion[]
  masteryMap: Record<string, number>
  source: 'mock' | 'api-fill-blank'
}

interface FillBlankBatchApiQuestion {
  id: string
  cardId: string
  exampleId: string
  type: string
  isRetry: boolean
  jlptLevel: string
  cardContent: string
  cardMeaning: string
  cardReading?: string
  promptSentence: string
  promptMeaning: string
  promptHint?: string
  correctAnswer: string
  acceptedAnswers: string[]
}

interface FillBlankBatchApiResponse {
  questions: FillBlankBatchApiQuestion[]
  masteryMap: Record<string, number>
}

interface SubmitFillBlankAnswerResult {
  isCorrect: boolean
  cardId: string
  exampleId: string
  nextExampleId?: string
  nextReviewExampleIndex: number
  wrongFeedback?: string
}

// Mock: returns pre-built quiz questions for given card IDs
// Real API: POST /api/quiz/batch { cardIds, type }
export async function getQuizBatch(
  cardIds: string[],
  forceType?: QuizForceType,
): Promise<QuizBatch> {
  if (!forceType || forceType === 'A') {
    try {
      const response = await api.get<ApiResponse<FillBlankBatchApiResponse>>('/cards/quiz/fill-blank-batch', {
        params: { cardIds: cardIds.join(',') },
      })

      if (response.data.success && response.data.data) {
        const questions: QuizQuestion[] = response.data.data.questions.map((q) => ({
          id: q.id,
          cardId: q.cardId,
          exampleId: q.exampleId,
          type: 'A',
          isRetry: q.isRetry,
          jlptLevel: q.jlptLevel,
          cardContent: q.cardContent,
          cardMeaning: q.cardMeaning,
          cardReading: q.cardReading,
          promptSentence: q.promptSentence,
          promptMeaning: q.promptMeaning,
          promptHint: q.promptHint,
          correctAnswer: q.correctAnswer,
          acceptedAnswers: q.acceptedAnswers,
        }))

        return {
          questions,
          masteryMap: response.data.data.masteryMap,
          source: 'api-fill-blank',
        }
      }
    } catch {
      // Fallback to mock generation when API is unavailable in local/dev.
    }
  }

  const questions: QuizQuestion[] = []
  const masteryMap: Record<string, number> = {}

  for (const id of cardIds) {
    const entry = MOCK_QUIZ_BANK[id]
    if (!entry) continue

    masteryMap[id] = entry.initialMastery

    const bank = entry.questions
    let question: QuizQuestion | undefined

    if (!forceType) {
      question = bank.A ?? bank.C ?? bank.B ?? bank.D
    } else {
      question = bank[forceType] ?? bank.A ?? bank.C ?? bank.B ?? bank.D
    }

    if (question) {
      questions.push({ ...question, id: `${question.id}-${Date.now()}` })
    }
  }

  return { questions, masteryMap, source: 'mock' }
}

export async function submitFillBlankAnswer(payload: {
  cardId: string
  exampleId: string
  userAnswer: string
}): Promise<SubmitFillBlankAnswerResult> {
  const response = await api.post<ApiResponse<SubmitFillBlankAnswerResult>>(
    '/cards/quiz/fill-blank/submit',
    payload,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return response.data.data
}
