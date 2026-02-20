import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CardNewForm from './CardNewForm'

export default async function CardNewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: deckId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: deck } = await supabase
    .from('decks')
    .select('id, language, user_id')
    .eq('id', deckId)
    .single()

  if (!deck || deck.user_id !== user?.id) notFound()

  return <CardNewForm deckId={deckId} language={deck.language} />
}
