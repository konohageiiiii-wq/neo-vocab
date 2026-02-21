'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createCard(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const deck_id = formData.get('deck_id') as string
  const word = formData.get('word') as string
  const reading = formData.get('reading') as string
  const meaning = formData.get('meaning') as string
  const part_of_speech = formData.get('part_of_speech') as string
  const level = formData.get('level') as string

  // デッキ所有権確認：自分のデッキにのみカード追加可能
  const { data: deck } = await supabase
    .from('decks')
    .select('user_id')
    .eq('id', deck_id)
    .single()

  if (!deck || deck.user_id !== user.id) return { error: '権限がありません' }

  const examplesRaw = formData.get('examples') as string
  let examples: string[] = []
  try {
    examples = JSON.parse(examplesRaw)
  } catch {
    examples = []
  }

  const memo = formData.get('memo') as string
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('cards').insert({
    deck_id,
    user_id: user.id,
    word,
    reading: reading || null,
    meaning,
    part_of_speech: part_of_speech || null,
    level: level || null,
    examples,
    memo: memo || null,
    image_url: image_url || null,
  })

  if (error) return { error: 'カードの作成に失敗しました' }

  revalidatePath(`/decks/${deck_id}`)
  redirect(`/decks/${deck_id}`)
}

export async function updateCard(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const card_id   = formData.get('card_id') as string
  const word      = formData.get('word') as string
  const reading   = formData.get('reading') as string
  const meaning   = formData.get('meaning') as string
  const memo      = formData.get('memo') as string
  const image_url = formData.get('image_url') as string

  const { data: card } = await supabase
    .from('cards')
    .select('user_id, deck_id')
    .eq('id', card_id)
    .single()

  if (!card || card.user_id !== user.id) return { error: '権限がありません' }

  const examplesRaw = formData.get('examples') as string
  let examples: string[] = []
  try { examples = JSON.parse(examplesRaw) } catch { examples = [] }

  const { error } = await supabase
    .from('cards')
    .update({
      word,
      reading: reading || null,
      meaning,
      examples,
      memo: memo || null,
      image_url: image_url || null,
    })
    .eq('id', card_id)
    .eq('user_id', user.id)

  if (error) return { error: 'カードの更新に失敗しました' }

  revalidatePath(`/decks/${card.deck_id}`)
  redirect(`/decks/${card.deck_id}`)
}

export async function deleteCard(cardId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { data: card } = await supabase
    .from('cards')
    .select('user_id, deck_id')
    .eq('id', cardId)
    .single()

  if (!card || card.user_id !== user.id) return { error: '権限がありません' }

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) return { error: '削除に失敗しました' }

  revalidatePath(`/decks/${card.deck_id}`)
  return { error: null }
}
