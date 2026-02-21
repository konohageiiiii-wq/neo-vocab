'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Google Cloud TTS Neural2 voice mapping (BCP-47 accent → voice)
const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  'en-US': { languageCode: 'en-US', name: 'en-US-Neural2-C' },
  'en-GB': { languageCode: 'en-GB', name: 'en-GB-Neural2-C' },
  'en-AU': { languageCode: 'en-AU', name: 'en-AU-Neural2-C' },
  'es-ES': { languageCode: 'es-ES', name: 'es-ES-Neural2-A' },
  'es-MX': { languageCode: 'es-US', name: 'es-US-Neural2-A' },
  'es-CO': { languageCode: 'es-US', name: 'es-US-Neural2-A' },
  'es-AR': { languageCode: 'es-US', name: 'es-US-Neural2-A' },
}

async function generateAudio(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  cardId: string,
  word: string,
  accent: string | null
): Promise<string | null> {
  try {
    const apiKey = process.env.GOOGLE_TTS_API_KEY
    if (!apiKey) return null

    const voice = VOICE_MAP[accent ?? ''] ?? { languageCode: 'en-US', name: 'en-US-Neural2-C' }

    const ttsRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: word },
          voice,
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    )

    if (!ttsRes.ok) return null

    const { audioContent } = await ttsRes.json() as { audioContent: string }
    const audioBuffer = Buffer.from(audioContent, 'base64')

    const filePath = `${userId}/${cardId}.mp3`
    const { error: uploadError } = await supabase.storage
      .from('card-audio')
      .upload(filePath, audioBuffer, { contentType: 'audio/mpeg', upsert: true })

    if (uploadError) return null

    const { data: { publicUrl } } = supabase.storage
      .from('card-audio')
      .getPublicUrl(filePath)

    return publicUrl
  } catch {
    return null
  }
}

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

  // デッキ所有権確認 + accent 取得
  const { data: deck } = await supabase
    .from('decks')
    .select('user_id, accent')
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

  const { data: newCard, error } = await supabase.from('cards').insert({
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
  }).select('id').single()

  if (error || !newCard) return { error: 'カードの作成に失敗しました' }

  // 音声を自動生成（失敗してもカード作成は続行）
  const audioUrl = await generateAudio(supabase, user.id, newCard.id, word, deck.accent)
  if (audioUrl) {
    await supabase.from('cards').update({ audio_url: audioUrl }).eq('id', newCard.id)
  }

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

  // 単語の音声を再生成（失敗しても更新は続行）
  const { data: deck } = await supabase
    .from('decks')
    .select('accent')
    .eq('id', card.deck_id)
    .single()

  const audioUrl = await generateAudio(supabase, user.id, card_id, word, deck?.accent ?? null)
  if (audioUrl) {
    await supabase.from('cards').update({ audio_url: audioUrl }).eq('id', card_id)
  }

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
