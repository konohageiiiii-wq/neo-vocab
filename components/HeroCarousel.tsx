'use client'

const CARDS_LEFT = [
  {
    word: 'persevere',
    reading: '/pərsɪˈvɪr/',
    meaning: '粘り強く続ける',
    image: '/lp/persevere.jpg',
    lang: 'EN',
  },
  {
    word: 'efímero',
    reading: '/eˈfimero/',
    meaning: 'はかない、一時的な',
    image: '/lp/efimero.jpg',
    lang: 'ES',
  },
  {
    word: 'eloquent',
    reading: '/ˈeləkwənt/',
    meaning: '雄弁な、言葉が達者な',
    image: '/lp/eloquent.jpg',
    lang: 'EN',
  },
  {
    word: 'añoranza',
    reading: '/aɲoˈɾansa/',
    meaning: '郷愁、懐かしさ',
    image: '/lp/anoranza.jpg',
    lang: 'ES',
  },
]

const CARDS_RIGHT = [
  {
    word: 'nostalgia',
    reading: '/nɒˈstældʒə/',
    meaning: '懐かしさ、郷愁',
    image: '/lp/nostalgia.jpg',
    lang: 'EN',
  },
  {
    word: 'madrugada',
    reading: '/madɾuˈɣaða/',
    meaning: '夜明け前、深夜',
    image: '/lp/madrugada.jpg',
    lang: 'ES',
  },
  {
    word: 'resilient',
    reading: '/rɪˈzɪliənt/',
    meaning: '回復力のある',
    image: '/lp/resilient.jpg',
    lang: 'EN',
  },
  {
    word: 'serenidad',
    reading: '/seɾeniˈðað/',
    meaning: '穏やかさ、平静',
    image: '/lp/serenidad.jpg',
    lang: 'ES',
  },
]

interface CardItem {
  word: string
  reading: string
  meaning: string
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
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
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
        <p style={{ fontSize: '11px', color: 'var(--lc-text-muted)', marginBottom: '6px' }}>
          {card.reading}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--lc-text-secondary)', fontWeight: 600 }}>
          {card.meaning}
        </p>
      </div>
    </div>
  )
}

export default function HeroCarousel() {
  // dup for seamless loop
  const left = [...CARDS_LEFT, ...CARDS_LEFT]
  const right = [...CARDS_RIGHT, ...CARDS_RIGHT]

  const SPEED = 28 // seconds for one full cycle

  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        height: '520px',
        overflow: 'hidden',
        position: 'relative',
        width: '320px',
      }}
    >
      {/* top / bottom gradient fade overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, #0F172A 0%, transparent 18%, transparent 82%, #0F172A 100%)',
        }}
      />

      {/* Column 1 — scroll up */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: `scrollUp ${SPEED}s linear infinite`,
          }}
        >
          {left.map((card, i) => (
            <FlashCard key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Column 2 — scroll down, offset start */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '-160px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: `scrollDown ${SPEED}s linear infinite`,
          }}
        >
          {right.map((card, i) => (
            <FlashCard key={i} card={card} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
