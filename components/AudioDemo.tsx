'use client'

import { useState, useCallback } from 'react'
import { Volume2 } from 'lucide-react'

const ACCENTS = [
  { label: '米', lang: 'en-US' },
  { label: '英', lang: 'en-GB' },
  { label: '豪', lang: 'en-AU' },
]

const WORD = 'persevere'

export default function AudioDemo() {
  const [selected, setSelected] = useState('en-US')
  const [playing, setPlaying] = useState(false)

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(WORD)
    utter.lang = selected
    utter.rate = 0.9

    // ボイスが読み込まれていれば言語に合うものを選択
    const voices = window.speechSynthesis.getVoices()
    const exact = voices.find((v) => v.lang === selected)
    const fallback = voices.find((v) => v.lang.startsWith(selected.split('-')[0]))
    if (exact) utter.voice = exact
    else if (fallback) utter.voice = fallback

    utter.onstart = () => setPlaying(true)
    utter.onend = () => setPlaying(false)
    utter.onerror = () => setPlaying(false)

    window.speechSynthesis.speak(utter)
  }, [selected])

  return (
    <div
      className="p-8 text-center"
      style={{
        background: 'var(--lc-surface)',
        border: '1px solid var(--lc-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
      }}
    >
      <p className="text-3xl font-black mb-1" style={{ color: 'var(--lc-text-primary)' }}>
        {WORD}
      </p>
      <p className="text-sm mb-8" style={{ color: 'var(--lc-text-muted)' }}>/pərsɪˈvɪr/</p>

      {/* 再生ボタン */}
      <button
        onClick={speak}
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer transition-opacity hover:opacity-80 active:scale-95"
        style={{
          background: playing
            ? 'linear-gradient(135deg, #06B6D4, #0EA5E9)'
            : 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
          outline: 'none',
          border: 'none',
          boxShadow: playing ? '0 0 0 6px rgba(14,165,233,0.2)' : 'none',
          transition: 'box-shadow 0.2s ease',
        }}
        aria-label="音声を再生"
      >
        <Volume2 size={28} style={{ color: 'white' }} />
      </button>

      <p className="text-xs mb-5" style={{ color: 'var(--lc-text-muted)' }}>
        {playing ? '再生中...' : 'クリックで発音を再生'}
      </p>

      {/* アクセント選択 */}
      <div className="flex items-center justify-center gap-2">
        {ACCENTS.map(({ label, lang }) => {
          const isActive = selected === lang
          return (
            <button
              key={lang}
              onClick={() => setSelected(lang)}
              className="text-xs px-3 py-1.5 cursor-pointer transition-all"
              style={{
                background: isActive ? '#0EA5E920' : 'var(--lc-bg)',
                border: isActive ? '1.5px solid #0EA5E9' : '1px solid var(--lc-border)',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#0EA5E9' : 'var(--lc-text-muted)',
                fontWeight: isActive ? 700 : 400,
                outline: 'none',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
