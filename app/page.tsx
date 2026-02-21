import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Brain, Repeat2, Mic2, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'NeoVocab — AI×間隔反復で語学学習',
  description: '単語を登録するだけでAIが例文を自動生成。SM-2間隔反復アルゴリズムで英語・スペイン語を効率よく学習。',
}

const secondaryFeatures = [
  { icon: Repeat2, title: '間隔反復（SM-2）', desc: '忘れる直前に出題。最短時間で最大定着。' },
  { icon: Mic2, title: 'ネイティブ発音', desc: '英語・スペイン語の音声を複数アクセントで確認。' },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen" style={{ background: 'var(--lc-bg)' }}>
      {/* Nav */}
      <nav style={{ background: '#0F172A' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-white font-bold text-lg tracking-tight">NeoVocab</span>
          <Link
            href="/auth"
            className="text-sm font-medium px-4 py-2 transition-colors"
            style={{ color: '#94A3B8', borderRadius: 'var(--radius-md)' }}
          >
            ログイン
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#0F172A' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold mb-8 px-3 py-1.5"
              style={{
                background: 'rgba(79,70,229,0.15)',
                color: '#A5B4FC',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(99,102,241,0.3)',
              }}
            >
              <Brain size={12} />
              AI × 間隔反復
            </div>

            <h1
              className="font-black leading-[1.08] mb-6"
              style={{ color: '#F8FAFC', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
            >
              語学学習を、
              <br />
              <span style={{ color: '#818CF8' }}>科学的に。</span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: '#94A3B8' }}
            >
              単語を登録するだけでAIが例文を3文生成。
              SM-2アルゴリズムが最適なタイミングで復習を促します。
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 transition-colors hover:opacity-90"
                style={{
                  background: 'var(--lc-accent)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                無料で始める
                <ChevronRight size={16} />
              </Link>
              <span className="text-sm" style={{ color: '#64748B' }}>
                クレジットカード不要
              </span>
            </div>
          </div>

          {/* Right: Card mockup */}
          <div className="hidden lg:flex justify-center">
            <div
              className="w-80 p-6 shadow-2xl"
              style={{
                background: 'var(--lc-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-1" style={{ background: 'var(--lc-accent-light)', color: 'var(--lc-accent)', borderRadius: 'var(--radius-sm)' }}>英語 B2</span>
                <span className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>2 / 12</span>
              </div>
              <div className="text-center py-8">
                <p className="text-4xl font-black mb-2" style={{ color: 'var(--lc-text-primary)' }}>resilient</p>
                <p className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>/rɪˈzɪliənt/</p>
              </div>
              <div
                className="p-4 mb-4 text-sm leading-relaxed"
                style={{ background: 'var(--lc-bg)', borderRadius: 'var(--radius-md)', color: 'var(--lc-text-secondary)' }}
              >
                &ldquo;She remained <strong style={{ color: 'var(--lc-accent)' }}>resilient</strong> despite the challenges.&rdquo;
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['難しい', '普通', '簡単'].map((label, i) => (
                  <button
                    key={label}
                    className="py-2 text-xs font-semibold"
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      background: i === 0 ? 'var(--lc-danger-light)' : i === 1 ? '#FFF7ED' : 'var(--lc-success-light)',
                      color: i === 0 ? 'var(--lc-danger)' : i === 1 ? '#D97706' : 'var(--lc-success)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Brain as hero, others secondary */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        {/* Primary feature */}
        <div
          className="flex flex-col lg:flex-row items-start gap-8 p-8 mb-6"
          style={{ background: 'var(--lc-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--lc-border)' }}
        >
          <div
            className="p-4 shrink-0"
            style={{ background: 'var(--lc-accent-light)', borderRadius: 'var(--radius-lg)' }}
          >
            <Brain size={32} style={{ color: 'var(--lc-accent)' }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--lc-accent)' }}>コア機能</p>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--lc-text-primary)' }}>
              AIが最適な例文を自動生成
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--lc-text-muted)' }}>
              単語・品詞・難易度・言語を指定するだけで、Claude AIがレベルに合った例文を3文生成します。
              フラッシュカードの裏面がすぐ完成し、登録ハードルがゼロに。
            </p>
          </div>
        </div>

        {/* Secondary features */}
        <div className="grid sm:grid-cols-2 gap-4">
          {secondaryFeatures.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6"
              style={{ background: 'var(--lc-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--lc-border)' }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center mb-4"
                style={{ background: 'var(--lc-bg)', borderRadius: 'var(--radius-md)' }}
              >
                <Icon size={20} style={{ color: 'var(--lc-text-secondary)' }} />
              </div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--lc-text-primary)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--lc-text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t"
        style={{ borderColor: 'var(--lc-border)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: 'var(--lc-text-primary)' }}>NeoVocab</span>
          <Link href="/auth" className="text-sm transition-colors" style={{ color: 'var(--lc-text-muted)' }}>
            ログイン / 新規登録
          </Link>
        </div>
      </footer>
    </div>
  )
}
