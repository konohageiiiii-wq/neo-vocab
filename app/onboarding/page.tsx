import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookOpen } from 'lucide-react'
import NicknameForm from './NicknameForm'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  // ニックネーム設定済みならダッシュボードへ
  if (user.user_metadata?.nickname) redirect('/dashboard')

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--lc-bg)' }}
    >
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 mb-4"
            style={{
              background: 'var(--lc-accent-light)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <BookOpen size={22} style={{ color: 'var(--lc-accent)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--lc-text-primary)' }}>
            ようこそ NeoVocab へ
          </h1>
          <p className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>
            ニックネームを設定してください
          </p>
        </div>

        {/* カード */}
        <div
          className="px-6 py-8"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <p className="text-sm font-medium mb-1 text-center" style={{ color: 'var(--lc-text-secondary)' }}>
            ニックネーム
          </p>
          <p className="text-xs mb-5 text-center" style={{ color: 'var(--lc-text-muted)' }}>
            ダッシュボードの挨拶に表示されます
          </p>
          <NicknameForm />
        </div>
      </div>
    </div>
  )
}
