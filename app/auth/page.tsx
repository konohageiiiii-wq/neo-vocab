'use client'

import { useActionState, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn, signUp, signInWithGoogle } from './actions'
import { Sparkles, Brain, Volume2, AlertCircle, MailCheck } from 'lucide-react'

const initialState = { error: null, message: null }

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: 'Googleログインに失敗しました。もう一度お試しください。',
  no_code:      'ログインに失敗しました。もう一度お試しください。',
}

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const searchParams = useSearchParams()

  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState)
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState)
  const [googleState, googleAction, googlePending] = useActionState(signInWithGoogle, initialState)

  const isSignIn = mode === 'signin'
  const action = isSignIn ? signInAction : signUpAction
  const pending = isSignIn ? signInPending : signUpPending
  const error = isSignIn ? signInState.error : signUpState.error
  const successMessage = !isSignIn ? signUpState.message : null

  // URL パラメータ（OAuth コールバックからのエラー・確認完了）または Google アクションのエラー
  const urlError = searchParams.get('error')
  const urlConfirmed = searchParams.get('confirmed') === 'true'
  const googleError = googleState.error ?? (urlError ? OAUTH_ERROR_MESSAGES[urlError] ?? 'ログインに失敗しました。' : null)

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* 左カラム：ブランドビジュアル */}
      <div
        className="relative lg:w-1/2 flex items-center justify-center p-8 lg:p-16 overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        <div className="relative z-10 text-center text-white max-w-md">
          {/* ロゴ */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <span
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold tracking-wide"
                style={{
                  background: 'rgba(79,70,229,0.15)',
                  color: '#A5B4FC',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                EN &middot; ES
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
              NeoVocab
            </h1>
            <p className="text-lg lg:text-xl" style={{ color: '#94A3B8' }}>
              楽しく、スマートに語学学習
            </p>
          </div>

          {/* フィーチャーカード */}
          <div className="hidden lg:flex flex-col gap-4 mt-8">
            <div
              className="flex items-center gap-4 p-4 text-left transition-colors duration-300"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="shrink-0 w-10 h-10 flex items-center justify-center"
                style={{ background: 'rgba(79,70,229,0.2)', borderRadius: 'var(--radius-md)' }}
              >
                <Sparkles size={20} style={{ color: '#A5B4FC' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#F8FAFC' }}>AIが例文を自動生成</p>
                <p className="text-sm" style={{ color: '#64748B' }}>単語を登録するだけで、実用的な例文を3つ作成</p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4 text-left transition-colors duration-300"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="shrink-0 w-10 h-10 flex items-center justify-center"
                style={{ background: 'rgba(79,70,229,0.2)', borderRadius: 'var(--radius-md)' }}
              >
                <Brain size={20} style={{ color: '#A5B4FC' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#F8FAFC' }}>間隔反復で効率学習</p>
                <p className="text-sm" style={{ color: '#64748B' }}>SM-2アルゴリズムで最適なタイミングで復習</p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4 text-left transition-colors duration-300"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="shrink-0 w-10 h-10 flex items-center justify-center"
                style={{ background: 'rgba(79,70,229,0.2)', borderRadius: 'var(--radius-md)' }}
              >
                <Volume2 size={20} style={{ color: '#A5B4FC' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#F8FAFC' }}>ネイティブ発音で確認</p>
                <p className="text-sm" style={{ color: '#64748B' }}>英語・スペイン語の音声読み上げに対応</p>
              </div>
            </div>
          </div>

          {/* モバイル用の簡易フィーチャー */}
          <div className="flex lg:hidden justify-center gap-6 mt-6">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: 'rgba(79,70,229,0.2)', borderRadius: 'var(--radius-md)' }}
            >
              <Sparkles size={18} style={{ color: '#A5B4FC' }} />
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: 'rgba(79,70,229,0.2)', borderRadius: 'var(--radius-md)' }}
            >
              <Brain size={18} style={{ color: '#A5B4FC' }} />
            </div>
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: 'rgba(79,70,229,0.2)', borderRadius: 'var(--radius-md)' }}
            >
              <Volume2 size={18} style={{ color: '#A5B4FC' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 右カラム：フォーム */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16" style={{ background: 'var(--lc-bg)' }}>
        <div className="w-full max-w-md">
          {/* モバイルロゴ（PC左カラムにある分は非表示） */}
          <div className="lg:hidden text-center mb-6">
            <p className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>アカウントで始めよう</p>
          </div>

          {/* ウェルカムテキスト（PCのみ） */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--lc-text-primary)' }}>
              {isSignIn ? 'おかえりなさい' : 'はじめまして'}
            </h2>
            <p className="mt-1" style={{ color: 'var(--lc-text-muted)' }}>
              {isSignIn
                ? 'アカウントにログインして学習を続けましょう'
                : '無料アカウントを作成して学習を始めましょう'}
            </p>
          </div>

          {/* タブ切り替え */}
          <div
            className="relative flex p-1 mb-8"
            style={{ background: 'var(--lc-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--lc-border)' }}
          >
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] shadow-sm transition-all duration-300 ease-out"
              style={{
                background: 'var(--lc-surface)',
                borderRadius: 'var(--radius-md)',
                left: isSignIn ? '4px' : 'calc(50% + 2px)',
              }}
            />
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-300"
              style={{
                borderRadius: 'var(--radius-md)',
                color: isSignIn ? 'var(--lc-text-primary)' : 'var(--lc-text-muted)',
              }}
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="relative z-10 flex-1 py-3 text-sm font-semibold transition-colors duration-300"
              style={{
                borderRadius: 'var(--radius-md)',
                color: !isSignIn ? 'var(--lc-text-primary)' : 'var(--lc-text-muted)',
              }}
            >
              新規登録
            </button>
          </div>

          {/* Googleログイン */}
          <form action={googleAction} className="mb-3">
            <button
              type="submit"
              disabled={googlePending}
              className="w-full py-3.5 flex items-center justify-center gap-3 text-base font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--lc-surface)',
                border: '1px solid var(--lc-border)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--lc-text-primary)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {googlePending ? '処理中...' : 'Googleでログイン'}
            </button>
          </form>

          {/* Google エラー */}
          {googleError && (
            <div
              className="flex items-center gap-3 text-sm px-4 py-3.5 mb-6"
              style={{
                color: 'var(--lc-danger)',
                background: 'var(--lc-danger-light)',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <AlertCircle size={18} className="shrink-0" />
              <p>{googleError}</p>
            </div>
          )}

          {/* 区切り線 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--lc-border)' }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--lc-text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--lc-border)' }} />
          </div>

          {/* メール確認完了メッセージ */}
          {urlConfirmed && (
            <div
              className="flex items-start gap-3 text-sm px-4 py-4 mb-6"
              style={{
                color: 'var(--lc-success)',
                background: 'var(--lc-success-light)',
                border: '1px solid #6EE7B7',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <MailCheck size={18} className="shrink-0 mt-0.5" />
              <p>メールアドレスの確認が完了しました。ログインしてください。</p>
            </div>
          )}

          {/* 登録完了メッセージ（確認メール送信後） */}
          {successMessage && (
            <div
              className="flex items-start gap-3 text-sm px-4 py-4"
              style={{
                color: 'var(--lc-success)',
                background: 'var(--lc-success-light)',
                border: '1px solid #6EE7B7',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <MailCheck size={18} className="shrink-0 mt-0.5" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* メール・パスワードフォーム */}
          <form action={action} className={`space-y-5 ${successMessage ? 'hidden' : ''}`}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold" style={{ color: 'var(--lc-text-secondary)' }}>
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3.5 text-base placeholder:text-gray-400 focus:outline-none transition-all duration-200"
                placeholder="you@example.com"
                style={{
                  background: 'var(--lc-surface)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--lc-text-primary)',
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'var(--lc-text-secondary)' }}>
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-3.5 text-base placeholder:text-gray-400 focus:outline-none transition-all duration-200"
                placeholder="英字と数字を含む8文字以上"
                style={{
                  background: 'var(--lc-surface)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--lc-text-primary)',
                }}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-3 text-sm px-4 py-3.5 animate-[shake_0.3s_ease-in-out]"
                style={{
                  color: 'var(--lc-danger)',
                  background: 'var(--lc-danger-light)',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:opacity-90"
              style={{
                background: 'var(--lc-accent)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  処理中...
                </span>
              ) : isSignIn ? 'ログイン' : '新規登録'}
            </button>
          </form>

          {/* フッター */}
          <p className="text-center text-xs mt-8" style={{ color: 'var(--lc-text-muted)' }}>
            続行することで、
            <a href="#" className="transition-colors" style={{ color: 'var(--lc-accent)' }}>利用規約</a>
            と
            <a href="#" className="transition-colors" style={{ color: 'var(--lc-accent)' }}>プライバシーポリシー</a>
            に同意したことになります。
          </p>
        </div>
      </div>
    </div>
  )
}
