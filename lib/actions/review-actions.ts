'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { calcNextReview } from '@/lib/sm2'

type Rating = 'easy' | 'normal' | 'hard'
type Mode = 'flashcard' | 'fill_in_blank'

const VALID_RATINGS: Rating[] = ['easy', 'normal', 'hard']
const VALID_MODES: Mode[]     = ['flashcard', 'fill_in_blank']

export async function submitReview(
  cardId: string,
  deckId: string,
  rating: Rating,
  isCorrect: boolean,
  mode: Mode
) {
  // ランタイムバリデーション（TypeScript の型は実行時に消えるため）
  if (!VALID_RATINGS.includes(rating)) throw new Error('無効な評価値です')
  if (!VALID_MODES.includes(mode))     throw new Error('無効なモードです')
  if (typeof isCorrect !== 'boolean')  throw new Error('無効な正解フラグです')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  // カード所有権確認：自分のカードのみ復習可能
  const { data: card } = await supabase
    .from('cards')
    .select('user_id')
    .eq('id', cardId)
    .single()

  if (!card || card.user_id !== user.id) throw new Error('権限がありません')

  // 既存の card_reviews を取得
  const { data: existing } = await supabase
    .from('card_reviews')
    .select('*')
    .eq('card_id', cardId)
    .eq('user_id', user.id)
    .single()

  const easeFactor = existing?.ease_factor ?? 2.5
  const interval = existing?.interval ?? 1
  const repetitions = existing?.repetitions ?? 0

  const { newEaseFactor, newInterval, newRepetitions } = calcNextReview(
    easeFactor,
    interval,
    repetitions,
    rating
  )

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval)

  // card_reviews を upsert
  await supabase.from('card_reviews').upsert({
    card_id: cardId,
    user_id: user.id,
    ease_factor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    next_review_at: nextReviewAt.toISOString(),
    last_reviewed_at: new Date().toISOString(),
  }, { onConflict: 'card_id,user_id' })

  // study_logs に記録
  await supabase.from('study_logs').insert({
    card_id: cardId,
    deck_id: deckId,
    user_id: user.id,
    rating,
    is_correct: isCorrect,
    mode,
  })

  revalidatePath(`/decks/${deckId}/study`)
}
