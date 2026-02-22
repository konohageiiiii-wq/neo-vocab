'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(
  _prevState: { error: string | null; message?: string | null },
  formData: FormData
): Promise<{ error: string | null; message?: string | null }> {
  const supabase = await createClient()

  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  // パスワード強度チェック：英字 + 数字を含む8文字以上
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/
  if (!passwordRegex.test(password)) {
    return { error: 'パスワードは英字と数字を組み合わせた8文字以上にしてください' }
  }

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    console.error('[signUp]', error.message)
    return { error: 'アカウント作成に失敗しました。もう一度お試しください。' }
  }

  if (data.session) {
    // メール確認不要の設定 → そのままダッシュボードへ
    redirect('/dashboard')
  }

  // メール確認が必要な場合 → 確認メール送信済みメッセージを返す
  return { error: null, message: '確認メールを送信しました。メール内のリンクをクリックしてからログインしてください。' }
}

export async function signIn(_prevState: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('[signIn]', error.message)
    return { error: 'メールアドレスまたはパスワードが正しくありません。' }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth')
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const supabase = await createClient()

  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
    console.error('[signInWithGoogle] NEXT_PUBLIC_SITE_URL が本番環境で未設定です。Google OAuth が正しく動作しません。')
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    console.error('[signInWithGoogle]', error.message)
    return { error: 'Googleログインに失敗しました。もう一度お試しください。' }
  }

  redirect(data.url)
}
