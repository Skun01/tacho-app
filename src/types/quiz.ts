export type QuestionType = 'A' | 'B' | 'C' | 'D'
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
  promptMeaning?: string     // Type A: Vietnamese meaning of the full prompt sentence
  promptKeyword?: string     // Type A: short word to highlight in promptMeaning (grammar cards)
  promptLabel?: string       // Type A fallback: "Từ có nghĩa là …?"
  audioUrl?: string          // Type B (word audio) + C
  exampleSentence?: string   // Type B: full sentence user must type
  exampleAudioUrl?: string   // Type B: audio of the example sentence
  exampleMeaning?: string    // Type B: Vietnamese meaning shown after answer
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
