import type { CardDetail, VocabCardDetail, GrammarCardDetail } from '@/types/card'
import type { QuizQuestion, QuizChoice } from '@/types/quiz'
import { DISTRACTOR_POOL } from '@/constants/quiz'

function blankify(sentence: string, target: string): string | null {
  if (!target || !sentence.includes(target)) return null
  return sentence.replace(target, '___')
}

function pickDistractors(correct: string, pool: string[], count = 3): string[] {
  const filtered = pool.filter((m) => m !== correct)
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function makeChoices(correct: string, distractors: string[]): QuizChoice[] {
  const all = [...distractors, correct].sort(() => Math.random() - 0.5)
  return all.map((label, i) => ({ id: `c${i}`, label, isCorrect: label === correct }))
}

function selectType(card: CardDetail): 'A' | 'B' | 'C' {
  const isVocab = card.type === 'vocab'
  const hasAudio = isVocab && !!(card as VocabCardDetail).audioUrl
  const roll = Math.random()
  if (hasAudio && roll < 0.33) return 'B'
  if (roll < 0.66) return 'C'
  return 'A'
}

export function generateQuestion(
  card: CardDetail,
  extraMeanings: string[] = [],
  forceType?: 'A' | 'B' | 'C',
): QuizQuestion {
  const type = forceType ?? selectType(card)
  const id = `q-${card.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const distractorPool = [...DISTRACTOR_POOL, ...extraMeanings].filter(
    (m) => m !== card.meaning,
  )

  if (card.type === 'vocab') {
    const vocab = card as VocabCardDetail
    const firstExample = vocab.examples[0]

    if (type === 'A') {
      const blanked = firstExample
        ? blankify(firstExample.japaneseSentence, vocab.content) ??
          blankify(firstExample.japaneseSentence, vocab.reading)
        : null
      return {
        id, cardId: card.id, type: 'A', isRetry: false,
        jlptLevel: card.jlptLevel,
        cardContent: vocab.content,
        cardMeaning: vocab.meaning,
        cardReading: vocab.reading,
        promptSentence: blanked ?? undefined,
        promptLabel: blanked ? undefined : `Từ có nghĩa là "${vocab.meaning}" là gì?`,
        correctAnswer: vocab.content,
        acceptedAnswers: [vocab.content, vocab.reading].filter(Boolean),
      }
    }

    if (type === 'B') {
      const exWithAudio = vocab.examples.find((e) => e.audioUrl)
      if (!exWithAudio) {
        // No example audio — fall back to Type A
        const blanked = firstExample
          ? blankify(firstExample.japaneseSentence, vocab.content) ??
            blankify(firstExample.japaneseSentence, vocab.reading)
          : null
        return {
          id, cardId: card.id, type: 'A', isRetry: false,
          jlptLevel: card.jlptLevel,
          cardContent: vocab.content,
          cardMeaning: vocab.meaning,
          cardReading: vocab.reading,
          promptSentence: blanked ?? undefined,
          promptLabel: blanked ? undefined : `Từ có nghĩa là "${vocab.meaning}" là gì?`,
          correctAnswer: vocab.content,
          acceptedAnswers: [vocab.content, vocab.reading].filter(Boolean),
        }
      }
      return {
        id, cardId: card.id, type: 'B', isRetry: false,
        jlptLevel: card.jlptLevel,
        cardContent: vocab.content,
        cardMeaning: vocab.meaning,
        cardReading: vocab.reading,
        exampleSentence: exWithAudio.japaneseSentence,
        exampleAudioUrl: exWithAudio.audioUrl,
        exampleMeaning: exWithAudio.vietnameseMeaning,
        correctAnswer: exWithAudio.japaneseSentence,
        acceptedAnswers: [exWithAudio.japaneseSentence],
      }
    }

    // Type C
    const distractors = pickDistractors(vocab.meaning, distractorPool)
    return {
      id, cardId: card.id, type: 'C', isRetry: false,
      jlptLevel: card.jlptLevel,
      cardContent: vocab.content,
      cardMeaning: vocab.meaning,
      cardReading: vocab.reading,
      audioUrl: vocab.audioUrl,
      correctAnswer: vocab.meaning,
      acceptedAnswers: [vocab.meaning],
      choices: makeChoices(vocab.meaning, distractors),
    }
  }

  // Grammar card
  const grammar = card as GrammarCardDetail
  const firstExample = grammar.examples[0]
  const strippedContent = grammar.content.replace(/^〜/, '')

  if (type === 'A' || type === 'B') {
    const blanked = firstExample
      ? blankify(firstExample.japaneseSentence, strippedContent) ??
        blankify(firstExample.japaneseSentence, grammar.content)
      : null
    return {
      id, cardId: card.id, type: 'A', isRetry: false,
      jlptLevel: card.jlptLevel,
      cardContent: grammar.content,
      cardMeaning: grammar.meaning,
      promptSentence: blanked ?? undefined,
      promptLabel: blanked ? undefined : `Cấu trúc có nghĩa "${grammar.meaning}" là gì?`,
      correctAnswer: grammar.content,
      acceptedAnswers: [grammar.content, strippedContent].filter(Boolean),
    }
  }

  // Type C grammar
  const distractors = pickDistractors(grammar.meaning, distractorPool)
  return {
    id, cardId: card.id, type: 'C', isRetry: false,
    jlptLevel: card.jlptLevel,
    cardContent: grammar.content,
    cardMeaning: grammar.meaning,
    correctAnswer: grammar.meaning,
    acceptedAnswers: [grammar.meaning],
    choices: makeChoices(grammar.meaning, distractors),
  }
}

export function checkAnswer(question: QuizQuestion, input: string): boolean {
  const normalized = input.trim()
  return question.acceptedAnswers.some((a) => a.trim() === normalized)
}
