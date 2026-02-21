'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function setNickname(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const nickname = (formData.get('nickname') as string).trim()

  if (!nickname) return { error: 'ニックネームを入力してください' }
  if (nickname.length > 20) return { error: 'ニックネームは20文字以内にしてください' }

  const { error } = await supabase.auth.updateUser({
    data: { nickname },
  })

  if (error) return { error: 'ニックネームの保存に失敗しました' }

  redirect('/dashboard')
}
