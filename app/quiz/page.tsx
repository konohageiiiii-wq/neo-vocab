import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuizClient from './QuizClient'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type CardRow = {
  id: string
  deck_id: string
  word: string
  reading: string | null
  meaning: string
  card_reviews: Array<{ ease_factor: number }> | null
}

// ease_factor による難易度分類
// 未学習(レビューなし) → 普通扱い
// < 1.8 → 難しい
// 1.8〜2.3 → 普通
// > 2.3 → 簡単
function classify(cards: CardRow[]) {
  const hard: CardRow[] = []
  const normal: CardRow[] = []
  const easy: CardRow[] = []
  for (const card of cards) {
    const ef = (card.card_reviews as Array<{ ease_factor: number }> | null)?.[0]?.ease_factor
    if (ef == null)   normal.push(card)
    else if (ef < 1.8) hard.push(card)
    else if (ef < 2.3) normal.push(card)
    else               easy.push(card)
  }
  return { hard, normal, easy }
}

// 難:普:易 = 5:3:2 の比率で最大 total 枚を選ぶ。
// 各バケツが足りない場合は他のバケツで補填する。
function selectByRatio(
  hard: CardRow[],
  normal: CardRow[],
  easy: CardRow[],
  total = 10,
): CardRow[] {
  const sH = shuffle(hard)
  const sN = shuffle(normal)
  const sE = shuffle(easy)

  const want = { h: 5, n: 3, e: 2 }
  const picked = [
    ...sH.slice(0, want.h),
    ...sN.slice(0, want.n),
    ...sE.slice(0, want.e),
  ]

  // 不足分を残りカードで補填
  if (picked.length < total) {
    const usedIds = new Set(picked.map((c) => c.id))
    const rest = shuffle([
      ...sH.slice(want.h),
      ...sN.slice(want.n),
      ...sE.slice(want.e),
    ].filter((c) => !usedIds.has(c.id)))
    picked.push(...rest.slice(0, total - picked.length))
  }

  return shuffle(picked).slice(0, total)
}

export default async function QuizPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: rawCards } = await supabase
    .from('cards')
    .select('id, deck_id, word, reading, meaning, card_reviews(ease_factor)')
    .eq('user_id', user.id)

  const cards = (rawCards ?? []) as CardRow[]
  if (cards.length < 4) redirect('/dashboard')

  const { hard, normal, easy } = classify(cards)
  const questionCards = selectByRatio(hard, normal, easy, 10)

  const questions = questionCards.map((card) => {
    // id と meaning 両方が異なるカードのみ wrong choice に使う
    const wrongChoices = shuffle(
      cards.filter((c) => c.id !== card.id && c.meaning !== card.meaning)
    )
      .slice(0, 3)
      .map((c) => c.meaning)
    const choices = shuffle([card.meaning, ...wrongChoices])
    return {
      cardId: card.id,
      deckId: card.deck_id,
      word: card.word,
      reading: card.reading,
      correctMeaning: card.meaning,
      choices,
    }
  })

  return <QuizClient questions={questions} />
}
