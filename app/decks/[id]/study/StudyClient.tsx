'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Tables } from '@/types/database.types'
import { submitReview } from '@/lib/actions/review-actions'

type Card = Tables<'cards'>
type Rating = 'easy' | 'normal' | 'hard'

// 高品質音声 (audio_url) を優先、なければ Web Speech API にフォールバック
function playAudio(audioUrl: string | null | undefined, word: string, accent: string) {
  if (audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play().catch(() => {})
    return
  }
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const speak = () => {
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      const langPrefix = accent.split('-')[0]
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find((v) => v.lang === accent)
        ?? voices.find((v) => v.lang.startsWith(langPrefix))
        ?? null
      if (voice) utterance.voice = voice
      utterance.lang = accent
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    } catch {}
  }
  // voices がまだ読み込まれていない場合は onvoiceschanged で待つ
  if (window.speechSynthesis.getVoices().length > 0) {
    speak()
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      speak()
    }
  }
}

export default function StudyClient({
  cards,
  deckId,
  deckName,
  accent,
  backHref,
  backLabel,
}: {
  cards: Card[]
  deckId: string
  deckName: string
  accent: string
  backHref?: string
  backLabel?: string
}) {
  const resolvedBackHref = backHref ?? `/decks/${deckId}`
  const resolvedBackLabel = backLabel ?? deckName
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const card = cards[index]


  const handleRate = useCallback(async (rating: Rating) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await submitReview(card.id, card.deck_id, rating, true, 'flashcard')
    } catch {
      // submitReview のエラーは無視して次のカードへ進む
    }
    const nextIndex = index + 1
    if (nextIndex >= cards.length) {
      setDone(true)
    } else {
      setIndex(nextIndex)
      setFlipped(false)
    }
    setSubmitting(false)
  }, [submitting, card, index, cards, accent])

  const handleRestart = () => {
    setIndex(0)
    setFlipped(false)
    setDone(false)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--lc-bg)' }}>
        <div className="text-center">
          <p className="text-xl font-semibold mb-2" style={{ color: 'var(--lc-text-primary)' }}>
            復習完了！
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--lc-text-muted)' }}>
            {cards.length} 枚を復習しました
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 text-white text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
            >
              もう一度復習する
            </button>
            <Link
              href={resolvedBackHref}
              className="px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-70 text-center"
              style={{
                border: '1px solid var(--lc-border)',
                color: 'var(--lc-text-secondary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              ← {resolvedBackLabel}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--lc-bg)' }}>
      {/* ヘッダー */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--lc-surface)', borderBottom: '1px solid var(--lc-border)' }}
      >
        <Link
          href={resolvedBackHref}
          className="text-sm transition-colors hover:opacity-70"
          style={{ color: 'var(--lc-text-muted)' }}
        >
          ← {resolvedBackLabel}
        </Link>
        <span className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>
          {index + 1} / {cards.length}
        </span>
      </div>

      {/* プログレスバー */}
      <div className="h-1" style={{ background: 'var(--lc-border)' }}>
        <div
          className="h-1 transition-all duration-300"
          style={{
            width: `${(index / cards.length) * 100}%`,
            background: 'var(--lc-accent)',
          }}
        />
      </div>

      {/* カード */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          {/* フラッシュカード本体 */}
          <div
            onClick={() => {
              // 表面: めくって音声再生 / 裏面: タップで再再生
              if (!flipped) {
                setFlipped(true)
              }
              playAudio(card.audio_url, card.word, accent)
            }}
            className={`rounded-2xl min-h-48 flex flex-col items-center justify-center select-none transition-shadow cursor-pointer hover:shadow-md`}
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              padding: '24px 20px',
            }}
          >
            {!flipped ? (
              /* 表面 */
              <>
                <p
                  className="font-bold mb-2 text-center leading-snug"
                  style={{
                    color: 'var(--lc-text-primary)',
                    fontSize: card.word.length > 35 ? '1rem'
                           : card.word.length > 20 ? '1.35rem'
                           : '1.875rem',
                  }}
                >
                  {card.word}
                </p>
                {card.reading && (
                  <p className="text-sm text-center" style={{ color: 'var(--lc-text-muted)' }}>
                    {card.reading}
                  </p>
                )}
                <p className="text-xs mt-5" style={{ color: 'var(--lc-border-strong)' }}>
                  タップして答えを確認
                </p>
              </>
            ) : (
              /* 裏面 */
              <div className="w-full space-y-3">
                <div className="text-center">
                  <p
                    className="font-bold leading-snug"
                    style={{
                      color: 'var(--lc-text-primary)',
                      fontSize: card.word.length > 35 ? '0.9rem'
                             : card.word.length > 20 ? '1.1rem'
                             : '1.5rem',
                    }}
                  >
                    {card.word}
                  </p>
                  {card.reading && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--lc-text-muted)' }}>
                      {card.reading}
                    </p>
                  )}
                </div>
                {card.image_url && (
                  <img
                    src={card.image_url}
                    alt={`${card.word} のイメージ`}
                    className="w-full max-h-44 object-cover mx-auto"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                )}
                <div className="pt-3" style={{ borderTop: '1px solid var(--lc-border)' }}>
                  <p className="text-base font-medium" style={{ color: 'var(--lc-text-secondary)' }}>
                    {card.meaning}
                  </p>
                </div>
                {card.examples && card.examples.length > 0 && (
                  <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--lc-border)' }}>
                    {card.examples.slice(0, 2).map((ex, i) => {
                      const [sentence, translation] = ex.split('\n')
                      return (
                        <div key={i}>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--lc-text-secondary)' }}>
                            {sentence}
                          </p>
                          {translation && (
                            <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--lc-text-muted)' }}>
                              {translation}
                            </p>
                          )}
                        </div>
                      )
                    })}
                    {card.examples.length > 2 && (
                      <p className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>
                        他 {card.examples.length - 2} 文
                      </p>
                    )}
                  </div>
                )}
                {/* 再生中ヒント */}
                <p className="text-xs text-center" style={{ color: 'var(--lc-border-strong)' }}>
                  タップで再生
                </p>
              </div>
            )}
          </div>

          {/* 評価ボタン（裏面表示後のみ） */}
          {flipped && (
            <div className="flex gap-3 mt-6">
              {(['hard', 'normal', 'easy'] as Rating[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRate(r)}
                  disabled={submitting}
                  className="flex-1 py-3 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    background:
                      r === 'hard' ? 'var(--lc-danger-light)' :
                      r === 'normal' ? '#FEF3C7' :
                      'var(--lc-success-light)',
                    color:
                      r === 'hard' ? 'var(--lc-danger)' :
                      r === 'normal' ? '#92400E' :
                      'var(--lc-success)',
                  }}
                >
                  {r === 'hard' ? '難しい' : r === 'normal' ? '普通' : '簡単'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
