'use client'

const CARDS_LEFT = [
  {
    word: 'persevere',
    reading: '/pərsɪˈvɪr/',
    meaning: '粘り強く続ける',
    example: ['She continued to ', 'persevere', ' despite every obstacle.'],
    translation: 'あらゆる障害にも、彼女は粘り強く続けた。',
    image: '/lp/persevere.jpg',
    lang: 'EN',
  },
  {
    word: 'efímero',
    reading: '/eˈfimero/',
    meaning: 'はかない、一時的な',
    example: ['La belleza de las flores es ', 'efímera', ' y preciosa.'],
    translation: '花の美しさははかなく、だからこそ貴い。',
    image: '/lp/efimero.jpg',
    lang: 'ES',
  },
  {
    word: 'eloquent',
    reading: '/ˈeləkwənt/',
    meaning: '雄弁な、言葉が達者な',
    example: ['Her ', 'eloquent', ' speech moved the entire audience.'],
    translation: '彼女の雄弁なスピーチは聴衆全員を感動させた。',
    image: '/lp/eloquent.jpg',
    lang: 'EN',
  },
  {
    word: 'añoranza',
    reading: '/aɲoˈɾansa/',
    meaning: '郷愁、懐かしさ',
    example: ['Siento ', 'añoranza', ' por los días de mi infancia.'],
    translation: '幼い頃の日々への郷愁を感じる。',
    image: '/lp/anoranza.jpg',
    lang: 'ES',
  },
]

const CARDS_RIGHT = [
  {
    word: 'nostalgia',
    reading: '/nɒˈstældʒə/',
    meaning: '懐かしさ、郷愁',
    example: ['The old music filled him with ', 'nostalgia', '.'],
    translation: '古い音楽が彼に深い郷愁をもたらした。',
    image: '/lp/nostalgia.jpg',
    lang: 'EN',
  },
  {
    word: 'madrugada',
    reading: '/madɾuˈɣaða/',
    meaning: '夜明け前、深夜',
    example: ['Llegó a casa en la ', 'madrugada', ' sin hacer ruido.'],
    translation: '彼は深夜、物音を立てずに帰宅した。',
    image: '/lp/madrugada.jpg',
    lang: 'ES',
  },
  {
    word: 'resilient',
    reading: '/rɪˈzɪliənt/',
    meaning: '回復力のある、しなやかな',
    example: ['Children are often more ', 'resilient', ' than we think.'],
    translation: '子どもたちは私たちが思う以上に回復力がある。',
    image: '/lp/resilient.jpg',
    lang: 'EN',
  },
  {
    word: 'serenidad',
    reading: '/seɾeniˈðað/',
    meaning: '穏やかさ、平静',
    example: ['Encontró la ', 'serenidad', ' en el sonido del mar.'],
    translation: '彼女は海の音の中に平静を見つけた。',
    image: '/lp/serenidad.jpg',
    lang: 'ES',
  },
]

interface CardItem {
  word: string
  reading: string
  meaning: string
  example: [string, string, string]
  translation: string
  image: string
  lang: string
}

function FlashCard({ card }: { card: CardItem }) {
  return (
    <div
      style={{
        background: 'var(--lc-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.30)',
        overflow: 'hidden',
        flexShrink: 0,
        width: '100%',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={card.word}
        style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
      />

      <div style={{ padding: '14px 16px 16px' }}>
        {/* 単語・読み */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
            <p style={{ fontSize: '20px', fontWeight: 900, color: 'var(--lc-text-primary)', lineHeight: 1.1 }}>
              {card.word}
            </p>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '999px',
                background: card.lang === 'EN' ? 'var(--lc-accent-light)' : '#FFF7ED',
                color: card.lang === 'EN' ? 'var(--lc-accent)' : '#D97706',
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}
            >
              {card.lang}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--lc-text-muted)' }}>{card.reading}</p>
        </div>

        {/* 例文 */}
        <div
          style={{
            background: 'var(--lc-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            marginBottom: '10px',
          }}
        >
          <p style={{ fontSize: '12px', lineHeight: 1.65, color: 'var(--lc-text-secondary)' }}>
            {card.example[0]}
            <strong style={{ color: 'var(--lc-accent)' }}>{card.example[1]}</strong>
            {card.example[2]}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--lc-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
            {card.translation}
          </p>
        </div>

        {/* 評価ボタン */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
          {[
            { label: '難しい', bg: 'var(--lc-danger-light)',  color: 'var(--lc-danger)' },
            { label: '普通',   bg: '#FFF7ED',                 color: '#D97706' },
            { label: '簡単',   bg: 'var(--lc-success-light)', color: 'var(--lc-success)' },
          ].map(({ label, bg, color }) => (
            <div
              key={label}
              style={{
                background: bg,
                color,
                borderRadius: 'var(--radius-sm)',
                padding: '6px 0',
                fontSize: '11px',
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
  )
}

export default function HeroCarousel() {
  const left  = [...CARDS_LEFT,  ...CARDS_LEFT]
  const right = [...CARDS_RIGHT, ...CARDS_RIGHT]

  const SPEED = 40 // seconds — slower to read comfortably

  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        height: '560px',
        overflow: 'hidden',
        position: 'relative',
        width: '330px',
      }}
    >
      {/* top / bottom gradient fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, #0F172A 0%, transparent 16%, transparent 84%, #0F172A 100%)',
        }}
      />

      {/* Column 1 — scroll up */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: `nv-scrollUp ${SPEED}s linear infinite`,
          }}
        >
          {left.map((card, i) => (
            <FlashCard key={i} card={card as CardItem} />
          ))}
        </div>
      </div>

      {/* Column 2 — scroll down, offset */}
      <div style={{ flex: 1, overflow: 'hidden', marginTop: '-200px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: `nv-scrollDown ${SPEED}s linear infinite`,
          }}
        >
          {right.map((card, i) => (
            <FlashCard key={i} card={card as CardItem} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes nv-scrollUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes nv-scrollDown {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
