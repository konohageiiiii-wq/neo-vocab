import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudyClient from './StudyClient'

export default async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date().toISOString()

  // deck と cards を並列取得、card_reviews を JOIN して1クエリに統合
  const [deckRes, cardsRes] = await Promise.all([
    supabase
      .from('decks')
      .select('id, name, language, accent, is_public, user_id')
      .eq('id', id)
      .single(),
    supabase
      .from('cards')
      .select('*, card_reviews(next_review_at)')
      .eq('deck_id', id),
  ])

  const deck = deckRes.data

  // アクセス権チェック：自分のデッキ or 公開デッキのみ
  if (!deck || (!deck.is_public && deck.user_id !== user?.id)) {
    notFound()
  }

  // due カードに絞る。なければ全カードをフォールバックとして使用
  const allCardsRaw = (cardsRes.data ?? []).map(({ card_reviews: _, ...card }) => card)
  const dueCards = (cardsRes.data ?? [])
    .filter((c) => {
      const review = (c.card_reviews as Array<{ next_review_at: string }> | null)?.[0]
      return !review || review.next_review_at <= now
    })
    .slice(0, 20)
    .map(({ card_reviews: _, ...card }) => card)

  const cards = dueCards.length > 0 ? dueCards : allCardsRaw.slice(0, 20)

  const defaultAccent = deck.language === 'es' ? 'es-ES' : 'en-US'
  const accent = deck.accent ?? defaultAccent

  return (
    <StudyClient
      cards={cards}
      deckId={id}
      deckName={deck.name}
      accent={accent}
    />
  )
}
