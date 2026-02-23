import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Brain, Volume2, Repeat2, PenLine, Sparkles, Layers,
  ChevronRight, ArrowRight, Check, X, RotateCcw, Plus, CheckCircle2,
  Image as ImageIcon, TrendingUp,
} from 'lucide-react'
import HeroCarousel from '@/components/HeroCarousel'
import AudioDemo from '@/components/AudioDemo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neo-vocab.vercel.app'

export const metadata: Metadata = {
  title: 'NeoVocab — AI×間隔反復で英語・スペイン語を科学的に学習',
  description: 'AIが例文・画像・音声を自動生成。SM-2間隔反復アルゴリズムで英語・スペイン語を効率学習。Google Neural2音声付き。完全無料。',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NeoVocab — AI×間隔反復で語学学習',
    description: 'AIが例文・画像を自動生成。SM-2で効率学習。完全無料。',
    url: SITE_URL,
    siteName: 'NeoVocab',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoVocab — AI×間隔反復で語学学習',
    description: 'AIが例文・画像を自動生成。SM-2で効率学習。完全無料。',
  },
  verification: {
    google: 'ABJHkp0aGNGnUIc7kHrQMcY0bNWpUMfJNe38BeY0p4o',
  },
}

// ─── 共通スタイルヘルパー ───────────────────────
const DARK = '#0F172A'
const DARK_SURFACE = '#1E293B'
const DARK_BORDER = 'rgba(255,255,255,0.08)'
const DARK_MUTED = '#94A3B8'
const DARK_SUB = '#64748B'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen" style={{ background: 'var(--lc-bg)' }}>

      {/* ═══ Nav ═══════════════════════════════════════════ */}
      <nav style={{ background: DARK, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-white font-bold text-lg tracking-tight">NeoVocab</span>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-sm font-medium px-4 py-2 transition-colors"
              style={{ color: DARK_MUTED }}
            >
              ブログ
            </Link>
            <Link
              href="/auth"
              className="text-sm font-medium px-4 py-2 transition-colors"
              style={{ color: DARK_MUTED }}
            >
              ログイン
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold text-white px-4 py-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
            >
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Hero ═══════════════════════════════════════════ */}
      <section style={{ background: DARK, position: 'relative', overflow: 'hidden' }}>

        {/* Background carousel — mobile only */}
        <div className="lg:hidden absolute inset-0 pointer-events-none opacity-[0.13]">
          <HeroCarousel />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Left */}
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
              AI × 間隔反復 × 画像生成
            </div>

            <h1
              className="font-black leading-[1.08] mb-6"
              style={{ color: '#F8FAFC', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
            >
              語学学習を、
              <br />
              <span style={{ color: '#818CF8' }}>科学的に。</span>
            </h1>

            <p className="text-xl font-semibold mb-6" style={{ color: '#CBD5E1' }}>
              自分だけのスマートなカスタムフラッシュカード
            </p>

            <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: DARK_MUTED }}>
              AIが例文・画像を自動生成。SM-2アルゴリズムが最適なタイミングで
              復習を促し、4択テストで定着を確認します。
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-3 transition-opacity hover:opacity-90"
                style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
              >
                無料で始める
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth"
                className="text-sm font-medium px-6 py-3 transition-opacity hover:opacity-70"
                style={{
                  color: DARK_MUTED,
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                ログイン
              </Link>
            </div>
            <p className="text-xs mt-4" style={{ color: DARK_SUB }}>
              登録30秒 • クレカ不要 • 完全無料
            </p>
          </div>

          {/* Right: Animated card carousel */}
          <div className="hidden lg:block w-full">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* ═══ Feature Overview Pills ══════════════════════════ */}
      <section style={{ background: 'var(--lc-surface)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-center mb-6" style={{ color: 'var(--lc-text-muted)' }}>
            NeoVocabにできること
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: ImageIcon, label: 'AI画像生成', color: '#8B5CF6', bg: '#F5F3FF' },
              { icon: Sparkles, label: 'AI例文生成', color: 'var(--lc-accent)', bg: 'var(--lc-accent-light)' },
              { icon: PenLine, label: '4択小テスト', color: '#D97706', bg: '#FFF7ED' },
              { icon: Brain, label: 'SM-2復習', color: 'var(--lc-success)', bg: 'var(--lc-success-light)' },
              { icon: Volume2, label: 'ネイティブ音声', color: '#0EA5E9', bg: '#F0F9FF' },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2"
                style={{ background: bg, color, borderRadius: 'var(--radius-full)', border: `1px solid ${color}22` }}
              >
                <Icon size={14} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Problem vs Solution ═════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--lc-text-muted)' }}>
            課題と解決
          </p>
          <h2 className="text-3xl font-black" style={{ color: 'var(--lc-text-primary)' }}>
            なぜ、語学学習は続かないのか
          </h2>
        </div>

        <div
          className="overflow-hidden"
          style={{ border: '1px solid var(--lc-border)', borderRadius: 'var(--radius-xl)' }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-2 px-6 py-3"
            style={{ background: 'var(--lc-bg)', borderBottom: '1px solid var(--lc-border)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lc-danger)' }}>
              従来の学習
            </p>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lc-success)' }}>
              NeoVocab
            </p>
          </div>

          {[
            ['単語のイメージが浮かばず忘れる', 'AIが単語のイメージ画像を自動生成'],
            ['例文を自分で調べるのが面倒', 'Claude AIが自然な例文＋和訳を即生成'],
            ['覚えたか確認する手段がない', '難易度別4択テストで即採点'],
            ['復習タイミングを自分で管理できない', 'SM-2が「今日やる枚数」だけ自動提示'],
            ['発音がわからず読み飛ばす', 'Google Neural2でネイティブ音声付き'],
          ].map(([bad, good], i) => (
            <div
              key={i}
              className="grid grid-cols-2 px-6 py-4"
              style={{ borderBottom: i < 4 ? '1px solid var(--lc-border)' : 'none', background: 'var(--lc-surface)' }}
            >
              <div className="flex items-start gap-2.5 pr-6" style={{ borderRight: '1px solid var(--lc-border)' }}>
                <X size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--lc-danger)' }} />
                <span className="text-sm" style={{ color: 'var(--lc-text-muted)' }}>{bad}</span>
              </div>
              <div className="flex items-start gap-2.5 pl-6">
                <Check size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--lc-success)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--lc-text-secondary)' }}>{good}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Feature Deep Dives ══════════════════════════════ */}

      {/* ① AI画像生成 */}
      <section style={{ background: 'var(--lc-surface)', borderTop: '1px solid var(--lc-border)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <p className="text-xl font-bold mb-3" style={{ color: '#8B5CF6' }}>
                最大の差別化機能
              </p>
              <h2 className="text-3xl font-black mb-5" style={{ color: 'var(--lc-text-primary)' }}>
                見て覚えるから、<br />忘れない。
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--lc-text-muted)' }}>
                単語を登録してボタンを押すだけ。AIが単語のイメージ画像を自動生成します。
                視覚記憶は言語記憶より長く保持されると言われており、
                単語とイメージを結びつけることで定着率が大きく向上します。
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#8B5CF6' }}>
                <ImageIcon size={16} />
                ワンクリックで画像生成
              </div>
            </div>
            {/* 2×2 card grid mockup */}
            <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm w-full">
              {[
                { img: '/lp/persevere.jpg', word: 'persevere' },
                { img: '/lp/eloquent.jpg',  word: 'eloquent' },
                { img: '/lp/nostalgia.jpg', word: 'nostalgia' },
                { img: '/lp/resilient.jpg', word: 'resilient' },
              ].map(({ img, word }) => (
                <div
                  key={word}
                  className="overflow-hidden"
                  style={{
                    background: 'var(--lc-surface)',
                    border: '1px solid var(--lc-border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={word} className="w-full object-cover" style={{ height: '100px' }} />
                  <div className="px-3 py-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--lc-text-primary)' }}>{word}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ② AI例文生成 */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--lc-accent)' }}>
                AI例文生成
              </p>
              <h2 className="text-3xl font-black mb-5" style={{ color: 'var(--lc-text-primary)' }}>
                文脈があると、<br />単語は定着する。
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--lc-text-muted)' }}>
                Claude AIが自然な英語・スペイン語の例文と日本語訳を自動生成。
                自分で例文を調べる手間がゼロになり、登録のハードルが消えます。
                単語を文脈の中で覚えることで、実際の会話にも活きる語彙力が身につきます。
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--lc-accent)' }}>
                <Sparkles size={16} />
                日本語訳も自動生成
              </div>
            </div>
            {/* Example sentence mockup */}
            <div className="flex-1 max-w-sm w-full">
              <div
                className="p-6"
                style={{
                  background: 'var(--lc-surface)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-black" style={{ color: 'var(--lc-text-primary)' }}>eloquent</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1"
                    style={{ background: 'var(--lc-accent-light)', color: 'var(--lc-accent)', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Sparkles size={10} />
                    AI生成
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      en: 'Her **eloquent** speech moved the entire audience.',
                      ja: '彼女の雄弁なスピーチは聴衆全員を感動させた。',
                    },
                    {
                      en: 'He was known for his **eloquent** writing style.',
                      ja: '彼は雄弁な文体で知られていた。',
                    },
                  ].map((ex, i) => (
                    <div
                      key={i}
                      className="p-3"
                      style={{ background: 'var(--lc-bg)', borderRadius: 'var(--radius-md)' }}
                    >
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--lc-text-secondary)' }}>
                        {ex.en.split('**').map((part, j) =>
                          j % 2 === 1
                            ? <strong key={j} style={{ color: 'var(--lc-accent)' }}>{part}</strong>
                            : part
                        )}
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--lc-text-muted)' }}>
                        {ex.ja}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ③ 小テスト */}
      <section style={{ background: 'var(--lc-surface)', borderTop: '1px solid var(--lc-border)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#D97706' }}>
                4択小テスト
              </p>
              <h2 className="text-3xl font-black mb-5" style={{ color: 'var(--lc-text-primary)' }}>
                確認なき学習は、<br />記憶にならない。
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--lc-text-muted)' }}>
                学んだ単語が本当に定着しているかを4択テストで確認。
                苦手な単語を優先出題するSM-2連携で、弱点を集中的に攻略できます。
                即時採点でその場でフィードバックを得られるため、記憶の定着が加速します。
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#D97706' }}>
                <PenLine size={16} />
                苦手単語を優先出題
              </div>
            </div>
            {/* Quiz mockup */}
            <div className="flex-1 max-w-sm w-full">
              <div
                style={{
                  background: 'var(--lc-surface)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid var(--lc-border)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>3 / 10</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5"
                    style={{ background: 'var(--lc-success-light)', color: 'var(--lc-success)', borderRadius: 'var(--radius-full)' }}
                  >
                    2正解
                  </span>
                </div>
                {/* Progress */}
                <div className="h-1" style={{ background: 'var(--lc-border)' }}>
                  <div className="h-1" style={{ width: '30%', background: '#F59E0B' }} />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-center mb-3" style={{ color: 'var(--lc-text-muted)' }}>
                    この単語の意味は？
                  </p>
                  <p className="text-2xl font-black text-center mb-5" style={{ color: 'var(--lc-text-primary)' }}>
                    resilient
                  </p>
                  <div className="space-y-2">
                    {[
                      { text: '困難に負けない、回復力のある', correct: true },
                      { text: '雄弁な、言葉が達者な', correct: false },
                      { text: '懐かしい気持ち、郷愁', correct: false },
                      { text: '粘り強く続ける', correct: false },
                    ].map((choice, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 text-sm flex items-center justify-between gap-2"
                        style={{
                          borderRadius: 'var(--radius-md)',
                          background: choice.correct ? 'var(--lc-success-light)' : 'var(--lc-bg)',
                          border: choice.correct ? '2px solid var(--lc-success)' : '1px solid var(--lc-border)',
                          color: choice.correct ? 'var(--lc-success)' : 'var(--lc-text-secondary)',
                          fontWeight: choice.correct ? 600 : 400,
                        }}
                      >
                        <span>{choice.text}</span>
                        {choice.correct && <CheckCircle2 size={14} style={{ color: 'var(--lc-success)', flexShrink: 0 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ④ SM-2スマート復習 */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--lc-success)' }}>
                SM-2スマート復習
              </p>
              <h2 className="text-3xl font-black mb-5" style={{ color: 'var(--lc-text-primary)' }}>
                忘れる直前に出題。<br />最短で最大定着。
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--lc-text-muted)' }}>
                忘却曲線に基づくSM-2アルゴリズムが、復習すべきタイミングを自動計算。
                無駄な反復をなくし、記憶を効率よく長期記憶へ定着させます。
                毎日のストリークとダッシュボードで学習の継続をサポートします。
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--lc-success)' }}>
                <Brain size={16} />
                今日やるべき枚数だけ出題
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="flex-1 max-w-sm w-full space-y-3">
              {[
                { label: '復習待ち', value: '12枚', sub: '今すぐ復習できます', accent: 'var(--lc-accent)', icon: Brain },
                { label: '学習ストリーク', value: '7日連続', sub: 'このまま続けよう', accent: '#F59E0B', icon: Repeat2 },
                { label: '総習得数', value: '84 / 120枚', sub: '70% 習得済み', accent: 'var(--lc-success)', icon: Layers },
              ].map(({ label, value, sub, accent, icon: Icon }) => (
                <div
                  key={label}
                  className="px-5 py-4"
                  style={{
                    background: 'var(--lc-surface)',
                    border: '1px solid var(--lc-border)',
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--lc-text-muted)' }}>{label}</span>
                    <Icon size={14} style={{ color: accent }} />
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--lc-text-primary)' }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--lc-text-muted)' }}>{sub}</p>
                </div>
              ))}
              {/* Mini bar chart */}
              <div
                className="px-5 py-4"
                style={{
                  background: 'var(--lc-surface)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium" style={{ color: 'var(--lc-text-muted)' }}>今週の学習</span>
                  <TrendingUp size={14} style={{ color: 'var(--lc-accent)' }} />
                </div>
                <div className="flex items-end gap-1.5 h-10">
                  {[3, 8, 5, 12, 7, 10, 15].map((h, i) => {
                    const isToday = i === 6
                    const barH = Math.round((h / 15) * 36)
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-sm"
                          style={{
                            height: `${barH}px`,
                            background: isToday ? 'var(--lc-accent)' : '#A5B4FC',
                          }}
                        />
                        <span style={{ fontSize: '9px', color: isToday ? 'var(--lc-accent)' : 'var(--lc-text-muted)', fontWeight: isToday ? 700 : 400 }}>
                          {['月','火','水','木','金','土','日'][i]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⑤ ネイティブ音声 */}
      <section style={{ background: 'var(--lc-surface)', borderTop: '1px solid var(--lc-border)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0EA5E9' }}>
                ネイティブ音声
              </p>
              <h2 className="text-3xl font-black mb-5" style={{ color: 'var(--lc-text-primary)' }}>
                耳で覚えると、<br />会話につながる。
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--lc-text-muted)' }}>
                Google Neural2音声合成で、ネイティブに近い自然な発音を確認できます。
                カードをめくると自動で音声が流れ、読み飛ばしを防ぎます。
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { lang: '英語', accents: ['米英語', '英国英語', '豪英語'], color: '#0EA5E9' },
                  { lang: 'スペイン語', accents: ['スペイン', 'メキシコ', '中南米'], color: '#8B5CF6' },
                ].map(({ lang, accents, color }) => (
                  <div key={lang} className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--lc-text-secondary)', minWidth: '80px' }}>{lang}</span>
                    {accents.map((a) => (
                      <span
                        key={a}
                        className="text-xs font-medium px-2.5 py-1"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 'var(--radius-full)' }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Audio card — interactive demo */}
            <div className="flex-1 max-w-sm w-full">
              <AudioDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--lc-text-muted)' }}>
            使い方
          </p>
          <h2 className="text-3xl font-black" style={{ color: 'var(--lc-text-primary)' }}>
            はじめ方はシンプル
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '01', icon: Layers, title: 'デッキを作る', desc: '英語・スペイン語のデッキを作成。公開されているデッキをそのまま使うことも可能です。', color: 'var(--lc-accent)' },
            { step: '02', icon: Plus, title: '単語を登録', desc: '単語と意味を入力してボタンを押すだけ。AIが例文・画像・音声を自動で生成します。', color: '#8B5CF6' },
            { step: '03', icon: RotateCcw, title: '毎日復習', desc: 'SM-2が今日やるべき枚数を提示。小テストで定着確認。ストリークを伸ばしましょう。', color: 'var(--lc-success)' },
          ].map(({ step, icon: Icon, title, desc, color }) => (
            <div
              key={step}
              className="p-7 relative"
              style={{
                background: 'var(--lc-surface)',
                border: '1px solid var(--lc-border)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <span
                className="text-5xl font-black absolute top-5 right-6 select-none"
                style={{ color: 'var(--lc-border)', lineHeight: 1 }}
              >
                {step}
              </span>
              <div
                className="w-12 h-12 flex items-center justify-center mb-5"
                style={{ background: `${color}15`, borderRadius: 'var(--radius-lg)' }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--lc-text-primary)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--lc-text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--lc-surface)', borderTop: '1px solid var(--lc-border)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--lc-text-muted)' }}>FAQ</p>
            <h2 className="text-3xl font-black" style={{ color: 'var(--lc-text-primary)' }}>よくある質問</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: '完全無料ですか？',
                a: 'はい、すべての機能を無料でご利用いただけます。クレジットカードの登録も一切不要です。',
              },
              {
                q: '対応している言語は？',
                a: '現在は英語（米・英・豪アクセント）とスペイン語（スペイン・メキシコ・コロンビア・アルゼンチン）に対応しています。',
              },
              {
                q: 'スマートフォンでも使えますか？',
                a: 'はい、レスポンシブデザインでスマートフォン・タブレット・PCすべてに対応しています。',
              },
              {
                q: 'AI画像・例文の生成回数に制限はありますか？',
                a: '月あたり例文生成・画像生成それぞれ300回の上限があります。上限はダッシュボードでいつでも確認できます。',
              },
            ].map(({ q, a }, i) => (
              <div
                key={i}
                className="p-6"
                style={{
                  background: 'var(--lc-bg)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <p className="font-bold mb-2" style={{ color: 'var(--lc-text-primary)' }}>{q}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--lc-text-muted)' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Final CTA ════════════════════════════════════════ */}
      <section style={{ background: DARK }}>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h2
            className="font-black mb-5 leading-tight"
            style={{ color: '#F8FAFC', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            今日から、科学的に<br />
            <span style={{ color: '#818CF8' }}>語学を学ぼう。</span>
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: DARK_MUTED }}>
            登録30秒。AIが例文・画像・音声を自動生成し、SM-2が復習をナビゲートする。
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-3 text-base font-bold text-white px-8 py-4 transition-opacity hover:opacity-90"
            style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-lg)' }}
          >
            無料で始める
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm mt-5" style={{ color: DARK_SUB }}>
            クレジットカード不要 • 登録30秒 • 完全無料
          </p>
        </div>
      </section>

      {/* ═══ Footer ══════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--lc-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-bold" style={{ color: 'var(--lc-text-primary)' }}>NeoVocab</span>
          <span className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>© 2026 NeoVocab</span>
          <Link href="/auth" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--lc-text-muted)' }}>
            ログイン / 新規登録
          </Link>
        </div>
      </footer>

    </div>
  )
}
