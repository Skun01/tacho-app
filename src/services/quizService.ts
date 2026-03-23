import type { QuizQuestion } from '@/types/quiz'
import type { QuizForceType } from '@/constants/quiz'
import { MOCK_QUIZ_BANK } from '@/mocks/quizBatch'

export interface QuizBatch {
  questions: QuizQuestion[]
  masteryMap: Record<string, number>
}

// Mock: returns pre-built quiz questions for given card IDs
// Real API: POST /api/quiz/batch { cardIds, type }
export async function getQuizBatch(
  cardIds: string[],
  forceType?: QuizForceType,
): Promise<QuizBatch> {
  const questions: QuizQuestion[] = []
  const masteryMap: Record<string, number> = {}

  for (const id of cardIds) {
    const entry = MOCK_QUIZ_BANK[id]
    if (!entry) continue

    masteryMap[id] = entry.initialMastery

    const bank = entry.questions
    let question: QuizQuestion | undefined

    if (!forceType || forceType === 'mixed') {
      question = bank.A ?? bank.C ?? bank.B
    } else {
      question = bank[forceType] ?? bank.A ?? bank.C ?? bank.B
    }

    if (question) {
      questions.push({ ...question, id: `${question.id}-${Date.now()}` })
    }
  }

  return { questions, masteryMap }
}
