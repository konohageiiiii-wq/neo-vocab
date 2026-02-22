'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, Trophy } from 'lucide-react'
import { submitReview } from '@/lib/actions/review-actions'

type QuizQuestion = {
  cardId: string
  deckId: string
  word: string
  reading: string | null
  correctMeaning: string
  choices: string[]
}

type AnswerState = { questionIndex: number; choice: string }

// ── サウンドエフェクト ──────────────────────────────────
function playCorrectSound() {
  if (typeof window === 'undefined') return
  try {
    const ctx = new AudioContext()
    const notes = [
      { freq: 783.99, start: 0,    dur: 0.18 },   // G5
      { freq: 1046.50, start: 0.13, dur: 0.28 },  // C6
    ]
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.22, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur)
    })
    setTimeout(() => ctx.close(), 1000)
  } catch {}
}

function playIncorrectSound() {
  if (typeof window === 'undefined') return
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(360, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(270, ctx.currentTime + 0.28)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.32)
    setTimeout(() => ctx.close(), 1000)
  } catch {}
}
// ─────────────────────────────────────────────────────

export default function QuizClient({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<AnswerState | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const advancing = useRef(false)

  const q = questions[index]
  const selected = answer?.questionIndex === index ? answer.choice : null

  const handleSelect = useCallback((choice: string) => {
    if (answer?.questionIndex === index || advancing.current) return
    advancing.current = true
    setAnswer({ questionIndex: index, choice })

    const isCorrect = choice === q.correctMeaning
    if (isCorrect) {
      setScore((s) => s + 1)
      playCorrectSound()
    } else {
      playIncorrectSound()
    }

    submitReview(q.cardId, q.deckId, isCorrect ? 'easy' : 'hard', isCorrect, 'flashcard').catch(() => {})

    setTimeout(() => {
      const nextIndex = index + 1
      if (nextIndex >= questions.length) {
        setDone(true)
      } else {
        setIndex(nextIndex)
      }
      advancing.current = false
    }, 1200)
  }, [answer, q, index, questions])

  const handleRestart = () => {
    setIndex(0)
    setAnswer(null)
    setScore(0)
    setDone(false)
    advancing.current = false
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const excellent = pct >= 80
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--lc-bg)' }}>
        <div
          className="w-full max-w-sm text-center px-8 py-10"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <Trophy
            size={36}
            className="mx-auto mb-4"
            style={{ color: excellent ? '#F59E0B' : 'var(--lc-border-strong)' }}
          />
          <p className="text-4xl font-bold mb-1" style={{ color: 'var(--lc-text-primary)' }}>
            {score}
            <span className="text-xl font-normal" style={{ color: 'var(--lc-text-muted)' }}>
              {' '}/ {questions.length}
            </span>
          </p>
          <p className="text-sm mb-1" style={{ color: 'var(--lc-text-muted)' }}>正答率 {pct}%</p>
          <p
            className="text-base font-semibold mt-3 mb-8"
            style={{ color: excellent ? 'var(--lc-success)' : 'var(--lc-text-secondary)' }}
          >
            {pct === 100 ? '満点！完璧です！' : pct >= 80 ? 'よくできました！' : pct >= 50 ? 'もう少し！' : '復習を続けましょう'}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestart}
              className="text-sm font-semibold text-white px-5 py-3 transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: '#F59E0B', borderRadius: 'var(--radius-md)' }}
            >
              もう一度挑戦する
            </button>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-center px-5 py-3 transition-colors hover:opacity-70"
              style={{ border: '1px solid var(--lc-border)', color: 'var(--lc-text-secondary)', borderRadius: 'var(--radius-md)' }}
            >
              ← ダッシュボードへ
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
        <Link href="/dashboard" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--lc-text-muted)' }}>
          ← ダッシュボード
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm tabular-nums" style={{ color: 'var(--lc-text-muted)' }}>
            {index + 1} / {questions.length}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--lc-success-light)', color: 'var(--lc-success)' }}
          >
            {score}正解
          </span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="h-1" style={{ background: 'var(--lc-border)' }}>
        <div
          className="h-1 transition-all duration-300"
          style={{ width: `${(index / questions.length) * 100}%`, background: '#F59E0B' }}
        />
      </div>

      {/* メイン */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-4">
          {/* 問題カード */}
          <div
            className="text-center px-6 py-8"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--lc-text-muted)' }}>
              この単語の意味は？
            </p>
            <p
              className="font-bold leading-snug"
              style={{
                color: 'var(--lc-text-primary)',
                fontSize: q.word.length > 30 ? '1.1rem' : q.word.length > 15 ? '1.5rem' : '1.875rem',
              }}
            >
              {q.word}
            </p>
            {q.reading && (
              <p className="text-sm mt-2" style={{ color: 'var(--lc-text-muted)' }}>{q.reading}</p>
            )}
          </div>

          {/* 選択肢 */}
          <div key={index} className="grid grid-cols-1 gap-2.5">
            {q.choices.map((choice, i) => {
              const isSelected = selected === choice
              const isCorrect = choice === q.correctMeaning
              let bg = 'var(--lc-surface)'
              let border = '1px solid var(--lc-border)'
              let color = 'var(--lc-text-primary)'
              if (selected !== null) {
                if (isCorrect)       { bg = 'var(--lc-success-light)'; border = '2px solid var(--lc-success)'; color = 'var(--lc-success)' }
                else if (isSelected) { bg = 'var(--lc-danger-light)';  border = '2px solid var(--lc-danger)';  color = 'var(--lc-danger)' }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(choice)}
                  disabled={selected !== null}
                  className="w-full px-5 py-4 text-left text-sm font-medium transition-all disabled:cursor-default"
                  style={{ background: bg, border, borderRadius: 'var(--radius-lg)', color }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="leading-snug">{choice}</span>
                    {selected !== null && isCorrect  && <CheckCircle2 size={16} style={{ color: 'var(--lc-success)', flexShrink: 0 }} />}
                    {selected !== null && isSelected && !isCorrect && <XCircle size={16} style={{ color: 'var(--lc-danger)', flexShrink: 0 }} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
