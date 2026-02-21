import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CardEditForm from './CardEditForm'

export default async function CardEditPage({
  params,
}: {
  params: Promise<{ id: string; cardId: string }>
}) {
  const { id: deckId, cardId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [cardRes, deckRes] = await Promise.all([
    supabase.from('cards').select('*').eq('id', cardId).eq('user_id', user?.id ?? '').single(),
    supabase.from('decks').select('language').eq('id', deckId).single(),
  ])

  if (!cardRes.data) notFound()

  return <CardEditForm card={cardRes.data} deckId={deckId} language={deckRes.data?.language ?? 'en'} />
}
