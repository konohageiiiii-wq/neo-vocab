import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { Settings } from 'lucide-react'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const currentNickname = (user.user_metadata?.nickname as string | undefined) ?? ''

  return (
    <div className="min-h-screen" style={{ background: 'var(--lc-bg)' }}>
      {/* ヘッダー */}
      <header style={{ background: 'var(--lc-surface)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm transition-colors hover:opacity-70"
            style={{ color: 'var(--lc-text-muted)' }}
          >
            ← ダッシュボード
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
              style={{ color: 'var(--lc-text-muted)' }}
            >
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Settings size={20} style={{ color: 'var(--lc-text-muted)' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--lc-text-primary)' }}>
            設定
          </h1>
        </div>

        {/* ニックネーム */}
        <div
          className="px-6 py-5"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--lc-text-primary)' }}>
            ニックネーム
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--lc-text-muted)' }}>
            ダッシュボードの挨拶に表示されます
          </p>
          <SettingsForm currentNickname={currentNickname} />
        </div>
      </main>
    </div>
  )
}
