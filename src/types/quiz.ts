export type QuestionType = 'A' | 'B' | 'C'
export type AnswerState = 'idle' | 'correct' | 'wrong'

export interface QuizChoice {
  id: string
  label: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  cardId: string
  type: QuestionType
  isRetry: boolean
  jlptLevel: string
  cardContent: string
  cardMeaning: string
  cardReading?: string
  promptSentence?: string    // Type A: example sentence with ___
  promptLabel?: string       // Type A fallback: "Từ có nghĩa là …?"
  audioUrl?: string          // Type B + C
  correctAnswer: string
  acceptedAnswers: string[]
  choices?: QuizChoice[]     // Type C only
}

export interface QuizAttempt {
  cardId: string
  questionId: string
  correct: boolean
  wasRetry: boolean
}

export interface MasteryChange {
  cardId: string
  before: number
  after: number
}
