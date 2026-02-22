'use client'

import { useState, useEffect } from 'react'

const CARDS = [
  {
    word: 'persevere',
    reading: '/pərsɪˈvɪr/',
    meaning: '粘り強く続ける',
    example: ['She continued to ', 'persevere', ' despite every obstacle.'],
    translation: 'あらゆる障害にも、彼女は粘り強く続けた。',
    image: '/lp/persevere.jpg',
  },
  {
    word: 'eloquent',
    reading: '/ˈeləkwənt/',
    meaning: '雄弁な、言葉が達者な',
    example: ['Her ', 'eloquent', ' speech moved the entire audience.'],
    translation: '彼女の雄弁なスピーチは聴衆全員を感動させた。',
    image: '/lp/eloquent.jpg',
  },
  {
    word: 'nostalgia',
    reading: '/nɒˈstældʒə/',
    meaning: '懐かしさ、郷愁',
    example: ['The old music filled him with ', 'nostalgia', '.'],
    translation: '古い音楽が彼に深い郷愁をもたらした。',
    image: '/lp/nostalgia.jpg',
  },
  {
    word: 'resilient',
    reading: '/rɪˈzɪliənt/',
    meaning: '回復力のある、しなやかな',
    example: ['Children are often more ', 'resilient', ' than we think.'],
    translation: '子どもたちは私たちが思う以上に回復力がある。',
    image: '/lp/resilient.jpg',
  },
]

const INTERVAL = 3800
const FADE_MS = 450

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    const timer = setInterval(() => {
      // フェードアウト
      setPhase('out')
      setTimeout(() => {
        setIndex((i) => (i + 1) % CARDS.length)
        // フェードイン
        setPhase('in')
      }, FADE_MS)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const card = CARDS[index]
  const visible = phase === 'in'

  return (
    <div className="flex flex-col items-center gap-4">
      {/* カード本体 */}
      <div
        style={{
          width: '320px',
          background: 'var(--lc-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0px)' : 'translateY(10px)',
        }}
      >
        {/* 画像エリア：正方形・全体表示 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={card.word}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* テキストエリア */}
        <div style={{ padding: '20px' }}>
          {/* 単語・読み */}
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '26px', fontWeight: 900, color: 'var(--lc-text-primary)', lineHeight: 1.1 }}>
              {card.word}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--lc-text-muted)', marginTop: '2px' }}>
              {card.reading}
            </p>
          </div>

          {/* 例文 */}
          <div
            style={{
              background: 'var(--lc-bg)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '14px',
            }}
          >
            <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--lc-text-secondary)' }}>
              {card.example[0]}
              <strong style={{ color: 'var(--lc-accent)' }}>{card.example[1]}</strong>
              {card.example[2]}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--lc-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              {card.translation}
            </p>
          </div>

          {/* 評価ボタン */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            {[
              { label: '難しい', bg: 'var(--lc-danger-light)', color: 'var(--lc-danger)' },
              { label: '普通',   bg: '#FFF7ED',                color: '#D97706' },
              { label: '簡単',   bg: 'var(--lc-success-light)', color: 'var(--lc-success)' },
            ].map(({ label, bg, color }) => (
              <div
                key={label}
                style={{
                  background: bg,
                  color,
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 0',
                  fontSize: '12px',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* プログレスドット */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setPhase('out')
              setTimeout(() => { setIndex(i); setPhase('in') }, FADE_MS)
            }}
            style={{
              width: i === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === index ? 'var(--lc-accent)' : 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: 'pointer',
              transition: 'width 0.3s ease, background 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
