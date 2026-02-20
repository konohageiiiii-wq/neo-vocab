type Rating = 'easy' | 'normal' | 'hard'

const RATING_SCORE: Record<Rating, number> = {
  easy: 5,
  normal: 3,
  hard: 1,
}

export function calcNextReview(
  easeFactor: number,
  interval: number,
  repetitions: number,
  rating: Rating
): { newEaseFactor: number; newInterval: number; newRepetitions: number } {
  const q = RATING_SCORE[rating]

  // ease factor 更新
  const newEaseFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  let newRepetitions: number
  let newInterval: number

  if (q < 3) {
    // 難しい場合はリセット
    newRepetitions = 0
    newInterval = 1
  } else {
    newRepetitions = repetitions + 1
    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = q >= 5 ? 5 : 3
    } else {
      newInterval = Math.round(interval * newEaseFactor)
    }
  }

  return { newEaseFactor, newInterval, newRepetitions }
}
