'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ImageIcon } from 'lucide-react'
import { Tables } from '@/types/database.types'
import { updateCard } from '@/lib/actions/card-actions'

const initialState = { error: null }

export default function CardEditForm({
  card,
  deckId,
  language,
}: {
  card: Tables<'cards'>
  deckId: string
  language: string
}) {
  const [state, action, pending] = useActionState(updateCard, initialState)

  const [word, setWord] = useState(card.word)
  const [meaning, setMeaning] = useState(card.meaning)
  const [examples, setExamples] = useState<string[]>(card.examples ?? [])
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  const [imageUrl, setImageUrl] = useState<string | null>(card.image_url ?? null)
  const [imageGenerating, setImageGenerating] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!word.trim()) { setGenError('単語を入力してください'); return }
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

  async function handleGenerateImage() {
    if (!word.trim()) { setImageError('単語を入力してください'); return }
    setImageGenerating(true)
    setImageError(null)
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, meaning, examples, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setImageUrl(data.imageUrl)
    } catch (e) {
      setImageError(e instanceof Error ? e.message : '画像生成に失敗しました')
    } finally {
      setImageGenerating(false)
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
        カードを編集
      </h1>

      <form action={action} className="space-y-5">
        <input type="hidden" name="card_id" value={card.id} />
        <input type="hidden" name="examples" value={JSON.stringify(examples)} />
        <input type="hidden" name="image_url" value={imageUrl ?? ''} />

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
            className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
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
            defaultValue={card.reading ?? ''}
            className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
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
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
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
            defaultValue={card.memo ?? ''}
            className="w-full px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-primary)',
            }}
            placeholder="語源・使い方のコツなど自由に"
          />
        </div>

        {/* 例文 */}
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
              例文
            </span>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
            >
              {generating ? '生成中...' : '例文を再生成'}
            </button>
          </div>

          {genError && (
            <p className="text-sm px-3 py-2" style={{ color: 'var(--lc-danger)', background: 'var(--lc-danger-light)', borderRadius: 'var(--radius-sm)' }}>
              {genError}
            </p>
          )}

          {examples.length > 0 ? (
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
          ) : (
            <p className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>
              例文なし — 「例文を再生成」で追加できます
            </p>
          )}
        </div>

        {/* AI画像生成 */}
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
              AI画像生成
            </span>
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={imageGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
            >
              <ImageIcon size={13} />
              {imageGenerating ? '生成中...' : '画像を再生成する'}
            </button>
          </div>

          {imageGenerating && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--lc-text-muted)' }}>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              画像を生成中...
            </div>
          )}

          {imageError && (
            <p
              className="text-sm px-3 py-2"
              style={{
                color: 'var(--lc-danger)',
                background: 'var(--lc-danger-light)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {imageError}
            </p>
          )}

          {imageUrl && (
            <div className="space-y-2">
              <img
                src={imageUrl}
                alt={`${word} のイメージ`}
                className="w-32 h-32 object-cover"
                style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--lc-border)' }}
              />
              <p className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>
                「画像を再生成する」で更新できます
              </p>
            </div>
          )}

          {!imageUrl && !imageGenerating && (
            <p className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>
              画像なし — 「画像を再生成する」で追加できます
            </p>
          )}
        </div>

        {state.error && (
          <p className="text-sm px-4 py-3" style={{ color: 'var(--lc-danger)', background: 'var(--lc-danger-light)', borderRadius: 'var(--radius-md)' }}>
            {state.error}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            href={`/decks/${deckId}`}
            className="flex-1 py-3 text-center text-sm font-medium transition-colors"
            style={{
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--lc-text-secondary)',
            }}
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 py-3 text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
          >
            {pending ? '保存中...' : '変更を保存'}
          </button>
        </div>
      </form>
    </div>
  )
}
