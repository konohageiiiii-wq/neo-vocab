'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function saveNickname(nickname: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const trimmed = nickname.trim()
  if (!trimmed) return { error: 'ニックネームを入力してください' }
  if (trimmed.length > 20) return { error: 'ニックネームは20文字以内にしてください' }

  const { error } = await supabase.auth.updateUser({
    data: { nickname: trimmed },
  })

  if (error) return { error: 'ニックネームの保存に失敗しました' }
  return { error: null }
}

export async function setNickname(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const result = await saveNickname(formData.get('nickname') as string)
  if (result.error) return result
  redirect('/dashboard')
}

export async function updateNickname(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const result = await saveNickname(formData.get('nickname') as string)
  if (result.error) return { error: result.error, success: false }
  return { error: null, success: true }
}
