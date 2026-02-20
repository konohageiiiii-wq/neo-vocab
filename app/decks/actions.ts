'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const VALID_LANGUAGES = ['en', 'es']
const VALID_ACCENTS   = ['en-US', 'en-GB', 'en-AU', 'es-ES', 'es-MX', 'es-CO', 'es-AR']

export async function createDeck(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const name        = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const language    = formData.get('language') as string
  const accent      = (formData.get('accent') as string) || null
  const is_public   = formData.get('is_public') === 'true'

  // 入力バリデーション
  if (!name)                                      return { error: 'デッキ名は必須です' }
  if (name.length > 100)                          return { error: 'デッキ名は100文字以内にしてください' }
  if (description && description.length > 500)    return { error: '説明は500文字以内にしてください' }
  if (!VALID_LANGUAGES.includes(language))        return { error: '無効な言語です' }
  if (accent && !VALID_ACCENTS.includes(accent))  return { error: '無効なアクセントです' }

  const { data, error } = await supabase
    .from('decks')
    .insert({ name, description, language, accent, is_public, user_id: user.id })
    .select('id')
    .single()

  if (error) return { error: 'デッキの作成に失敗しました' }

  revalidatePath('/decks')
  redirect(`/decks/${data.id}`)
}

export async function deleteDeck(deckId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  // 所有権確認：自分のデッキのみ削除可能
  const { data: deck } = await supabase
    .from('decks')
    .select('user_id')
    .eq('id', deckId)
    .single()

  if (!deck || deck.user_id !== user.id) throw new Error('権限がありません')

  const { error } = await supabase
    .from('decks')
    .delete()
    .eq('id', deckId)
    .eq('user_id', user.id)

  if (error) throw new Error('削除に失敗しました')

  revalidatePath('/decks')
  redirect('/decks')
}
