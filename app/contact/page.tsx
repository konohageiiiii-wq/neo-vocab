'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Send, CheckCircle2 } from 'lucide-react'
import { sendContactEmail, ContactState } from './actions'

const initialState: ContactState = { success: false, error: null }

export default function ContactPage() {
  const [state, action, pending] = useActionState(sendContactEmail, initialState)

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--lc-bg)' }}>
        <div
          className="w-full max-w-sm text-center px-8 py-12"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: 'var(--lc-success)' }} />
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--lc-text-primary)' }}>
            送信完了しました
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--lc-text-muted)' }}>
            お問い合わせを受け付けました。
            <br />
            内容を確認の上、ご連絡いたします。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 transition-opacity hover:opacity-90"
            style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--lc-bg)' }}>
      {/* ヘッダー */}
      <header style={{ background: 'var(--lc-surface)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--lc-text-muted)' }}
          >
            <ChevronLeft size={16} />
            ダッシュボード
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--lc-text-primary)' }}>
            お問い合わせ
          </h1>
          <p className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>
            ご質問・不具合報告・ご意見などはこちらからお送りください。
          </p>
        </div>

        <form
          action={action}
          className="space-y-5"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
          }}
        >
          {/* お名前 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--lc-text-secondary)' }}
            >
              お名前 <span style={{ color: 'var(--lc-danger)' }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="山田 太郎"
              className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none"
              style={{
                background: 'var(--lc-bg)',
                border: '1px solid var(--lc-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--lc-text-primary)',
              }}
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--lc-text-secondary)' }}
            >
              メールアドレス <span style={{ color: 'var(--lc-danger)' }}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none"
              style={{
                background: 'var(--lc-bg)',
                border: '1px solid var(--lc-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--lc-text-primary)',
              }}
            />
          </div>

          {/* メッセージ */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--lc-text-secondary)' }}
            >
              メッセージ <span style={{ color: 'var(--lc-danger)' }}>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="お問い合わせ内容をご記入ください"
              className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none resize-none"
              style={{
                background: 'var(--lc-bg)',
                border: '1px solid var(--lc-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--lc-text-primary)',
              }}
            />
          </div>

          {/* エラー */}
          {state.error && (
            <p className="text-sm" style={{ color: 'var(--lc-danger)' }}>
              {state.error}
            </p>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
          >
            <Send size={14} />
            {pending ? '送信中...' : '送信する'}
          </button>
        </form>
      </main>
    </div>
  )
}
