import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${origin}/auth?error=oauth_failed`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=no_code`)
  }

  const supabase = await createClient()
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/auth?error=oauth_failed`)
  }

  // メール確認フロー（セッションなし）→ ログイン画面へ案内
  if (!data.session) {
    return NextResponse.redirect(`${origin}/auth?confirmed=true`)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
