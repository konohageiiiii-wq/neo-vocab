'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { createCard } from '@/lib/actions/card-actions'

const initialState = { error: null }

export default function CardNewForm({
  deckId,
  language,
}: {
  deckId: string
  language: string
}) {
  const [state, action, pending] = useActionState(createCard, initialState)

  const [examples, setExamples] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [word, setWord] = useState('')

  async function handleGenerate() {
    if (!word.trim()) {
      setGenError('単語を入力してください')
      return
    }
    setGenerating(true)
    setGenError(null)
    try {
      const res = await fetch('/api/generate-examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setExamples(data.examples)
    } catch (e) {
      setGenError(e instanceof Error ? e.message : '例文生成に失敗しました')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/decks/${deckId}`} className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>
          ← デッキ詳細に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--lc-text-primary)' }}>
        カード追加
      </h1>

      <form action={action} className="space-y-5">
        <input type="hidden" name="deck_id" value={deckId} />
        <input type="hidden" name="examples" value={JSON.stringify(examples)} />

        {/* 単語 */}
        <div>
          <label htmlFor="word" className="block text-sm font-medium mb-1" style={{ color: 'var(--lc-text-secondary)' }}>
            単語 <span style={{ color: 'var(--lc-danger)' }}>*</span>
          </label>
          <input
            id="word"
            name="word"
            type="text"
            required
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
            placeholder="例：serendipity"
          />
        </div>

        {/* 読み方 */}
        <div>
          <label htmlFor="reading" className="block text-sm font-medium mb-1" style={{ color: 'var(--lc-text-secondary)' }}>
            読み方・発音
          </label>
          <input
            id="reading"
            name="reading"
            type="text"
            className="w-full px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
            placeholder="例：/ˌser.ənˈdɪp.ɪ.ti/"
          />
        </div>

        {/* 意味 */}
        <div>
          <label htmlFor="meaning" className="block text-sm font-medium mb-1" style={{ color: 'var(--lc-text-secondary)' }}>
            意味 <span style={{ color: 'var(--lc-danger)' }}>*</span>
          </label>
          <input
            id="meaning"
            name="meaning"
            type="text"
            required
            className="w-full px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
            placeholder="例：思いがけない幸運"
          />
        </div>

        {/* メモ */}
        <div>
          <label htmlFor="memo" className="block text-sm font-medium mb-1" style={{ color: 'var(--lc-text-secondary)' }}>
            メモ
          </label>
          <textarea
            id="memo"
            name="memo"
            rows={2}
            className="w-full px-4 py-3 text-sm resize-none transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
            placeholder="語源・使い方のコツなど自由に"
          />
        </div>

        {/* AI例文生成 */}
        <div
          className="p-4 space-y-3"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--lc-text-secondary)' }}>
              AI例文生成
            </span>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
            >
              {generating ? '生成中...' : '例文を生成する'}
            </button>
          </div>

          {generating && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--lc-text-muted)' }}>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Claude が例文を生成中...
            </div>
          )}

          {genError && (
            <p
              className="text-sm px-3 py-2"
              style={{
                color: 'var(--lc-danger)',
                background: 'var(--lc-danger-light)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {genError}
            </p>
          )}

          {examples.length > 0 && (
            <div className="space-y-2">
              {examples.map((ex, i) => (
                <textarea
                  key={i}
                  value={ex}
                  onChange={(e) => {
                    const updated = [...examples]
                    updated[i] = e.target.value
                    setExamples(updated)
                  }}
                  rows={2}
                  className="w-full px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--lc-bg)',
                    border: '1px solid var(--lc-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--lc-text-primary)',
                  }}
                />
              ))}
              <p className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>例文は編集できます</p>
            </div>
          )}
        </div>

        {state.error && (
          <p
            className="text-sm px-4 py-3"
            style={{
              color: 'var(--lc-danger)',
              background: 'var(--lc-danger-light)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 text-white font-medium text-base transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
        >
          {pending ? '保存中...' : 'カードを保存する'}
        </button>
      </form>
    </div>
  )
}
