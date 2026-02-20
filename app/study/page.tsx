import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudyClient from '@/app/decks/[id]/study/StudyClient'

export default async function AllStudyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const now = new Date().toISOString()

  const [decksRes, cardsRes] = await Promise.all([
    supabase.from('decks').select('id, language, accent').eq('user_id', user.id),
    supabase
      .from('cards')
      .select('*, card_reviews(next_review_at)')
      .eq('user_id', user.id),
  ])

  const decks = decksRes.data ?? []
  const firstDeck = decks[0]
  const defaultAccent = firstDeck?.language === 'es' ? 'es-ES' : 'en-US'
  const accent = firstDeck?.accent ?? defaultAccent

  const allCardsRaw = (cardsRes.data ?? []).map(({ card_reviews: _, ...card }) => card)
  const dueCards = (cardsRes.data ?? [])
    .filter((c) => {
      const review = (c.card_reviews as Array<{ next_review_at: string }> | null)?.[0]
      return !review || review.next_review_at <= now
    })
    .slice(0, 50)
    .map(({ card_reviews: _, ...card }) => card)

  const cards = dueCards.length > 0 ? dueCards : allCardsRaw.slice(0, 50)

  return (
    <StudyClient
      cards={cards}
      deckId=""
      deckName=""
      accent={accent}
      backHref="/dashboard"
      backLabel="ダッシュボード"
    />
  )
}
