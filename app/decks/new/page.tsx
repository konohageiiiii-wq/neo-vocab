'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { createDeck } from '../actions'

const initialState = { error: null }

const ACCENT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  en: [
    { value: 'en-US', label: '🇺🇸 アメリカ英語 (en-US)' },
    { value: 'en-GB', label: '🇬🇧 イギリス英語 (en-GB)' },
    { value: 'en-AU', label: '🇦🇺 オーストラリア英語 (en-AU)' },
  ],
  es: [
    { value: 'es-ES', label: '🇪🇸 スペイン (es-ES)' },
    { value: 'es-MX', label: '🇲🇽 メキシコ (es-MX)' },
    { value: 'es-CO', label: '🇨🇴 コロンビア (es-CO)' },
    { value: 'es-AR', label: '🇦🇷 アルゼンチン (es-AR)' },
  ],
}

export default function NewDeckPage() {
  const [state, action, pending] = useActionState(createDeck, initialState)
  const [language, setLanguage] = useState<'en' | 'es'>('en')

  const accentOptions = ACCENT_OPTIONS[language]

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/decks" className="text-sm text-gray-500 hover:text-gray-700">
          ← デッキ一覧に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">新規デッキ作成</h1>

      <form action={action} className="space-y-5">
        {/* デッキ名 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            デッキ名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="例：TOEIC 頻出単語"
          />
        </div>

        {/* 説明 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="任意でデッキの説明を入力"
          />
        </div>

        {/* 言語 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            言語 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {[
              { value: 'en' as const, label: '英語' },
              { value: 'es' as const, label: 'スペイン語' },
            ].map((lang) => (
              <label key={lang.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value={lang.value}
                  checked={language === lang.value}
                  onChange={() => setLanguage(lang.value)}
                  className="w-4 h-4 accent-gray-900"
                />
                <span className="text-base">{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* アクセント */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            音声アクセント
          </label>
          <div className="space-y-2">
            {accentOptions.map((opt, i) => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="accent"
                  value={opt.value}
                  defaultChecked={i === 0}
                  key={`${language}-${opt.value}`}
                  className="w-4 h-4 accent-gray-900"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            ブラウザが未対応の場合は同じ言語の別アクセントを自動選択します
          </p>
        </div>

        {/* 公開設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">公開設定</label>
          <div className="flex gap-3">
            {[
              { value: 'false', label: '非公開' },
              { value: 'true', label: '公開' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="is_public"
                  value={opt.value}
                  defaultChecked={opt.value === 'false'}
                  className="w-4 h-4 accent-gray-900"
                />
                <span className="text-base">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg text-base hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? '作成中...' : 'デッキを作成'}
        </button>
      </form>
    </div>
  )
}
