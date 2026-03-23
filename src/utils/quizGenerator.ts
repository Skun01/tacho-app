import { toHiragana } from 'wanakana'
import type { QuizQuestion } from '@/types/quiz'

export function checkAnswer(question: QuizQuestion, input: string): boolean {
  const norm = (s: string) => toHiragana(s.trim())
  return question.acceptedAnswers.some((a) => norm(a) === norm(input))
}
