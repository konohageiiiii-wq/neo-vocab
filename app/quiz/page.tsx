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

export default async function QuizPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: cards } = await supabase
    .from('cards')
    .select('id, deck_id, word, reading, meaning')
    .eq('user_id', user.id)

  if (!cards || cards.length < 4) redirect('/dashboard')

  const questionCards = shuffle(cards).slice(0, 10)

  const questions = questionCards.map((card) => {
    // id が異なるだけでなく meaning も異なるカードのみ wrong choice にする
    // （同じ意味のカードが混入すると正解が2つ表示されるバグの原因になる）
    const wrongChoices = shuffle(cards.filter((c) => c.id !== card.id && c.meaning !== card.meaning))
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
