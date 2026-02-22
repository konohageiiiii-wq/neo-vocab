import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* バッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(79,70,229,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '999px',
            padding: '8px 18px',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: '#A5B4FC', fontSize: '16px', fontWeight: 600 }}>
            AI × 間隔反復 × 画像生成
          </span>
        </div>

        {/* タイトル */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            color: '#F8FAFC',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          語学学習を、
          <br />
          <span style={{ color: '#818CF8' }}>科学的に。</span>
        </div>

        {/* サブコピー */}
        <div
          style={{
            fontSize: '26px',
            color: '#94A3B8',
            marginBottom: '48px',
          }}
        >
          AIが例文・画像・音声を自動生成。SM-2で最適タイミングに復習。完全無料。
        </div>

        {/* ブランド */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#818CF8',
          }}
        >
          NeoVocab
        </div>
      </div>
    ),
    { ...size }
  )
}
