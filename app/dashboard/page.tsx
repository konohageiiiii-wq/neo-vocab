import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import {
  Flame, ArrowRight, Plus, BookOpen,
  RotateCcw, CheckCircle2, Layers, Brain, TrendingUp, TrendingDown, Settings, PenLine,
} from 'lucide-react'

function formatTimeUntil(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'まもなく'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h >= 24) return `${Math.floor(h / 24)}日後`
  if (h > 0) return `${h}時間${m}分後`
  return `${m}分後`
}

function easeBadge(ef: number): { label: string; bg: string; color: string } {
  if (ef < 1.8) return { label: 'とても難しい', bg: 'var(--lc-danger-light)', color: 'var(--lc-danger)' }
  if (ef < 2.1) return { label: '難しい', bg: '#FEF3C7', color: '#D97706' }
  return { label: 'やや難しい', bg: '#FEF9C3', color: '#A16207' }
}

type StatCardProps = {
  label: string
  value: string | number
  unit?: string
  sub: string
  subColor?: string
  iconEl: React.ReactNode
  accentColor: string
  trend?: number | null
}

function StatCard({ label, value, unit, sub, subColor, iconEl, accentColor, trend }: StatCardProps) {
  return (
    <div
      className="px-5 py-4"
      style={{
        background: 'var(--lc-surface)',
        border: '1px solid var(--lc-border)',
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--lc-text-muted)' }}>{label}</span>
        <span style={{ color: accentColor }}>{iconEl}</span>
      </div>
      <p className="text-2xl font-bold leading-none mb-1" style={{ color: 'var(--lc-text-primary)' }}>
        {value}
        {unit && (
          <span className="text-sm font-normal ml-1.5" style={{ color: 'var(--lc-text-muted)' }}>
            {unit}
          </span>
        )}
      </p>
      {typeof trend === 'number' ? (
        <div className="flex items-center gap-1 mt-1">
          {trend >= 0
            ? <TrendingUp size={11} style={{ color: 'var(--lc-success)' }} />
            : <TrendingDown size={11} style={{ color: 'var(--lc-danger)' }} />
          }
          <span
            className="text-xs font-semibold"
            style={{ color: trend >= 0 ? 'var(--lc-success)' : 'var(--lc-danger)' }}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>先週比</span>
        </div>
      ) : (
        <p className="text-xs" style={{ color: subColor ?? 'var(--lc-text-muted)' }}>{sub}</p>
      )}
    </div>
  )
}

type WeekDay = { day: string; label: string; count: number }

function WeeklyActivityChart({ data, total }: { data: WeekDay[]; total: number }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div
      style={{
        background: 'var(--lc-surface)',
        border: '1px solid var(--lc-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--lc-text-muted)' }}
          >
            今週の学習
          </h3>
          <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--lc-text-primary)' }}>
            {total}
            <span className="text-sm font-normal ml-1" style={{ color: 'var(--lc-text-muted)' }}>回</span>
          </p>
        </div>
        <TrendingUp size={15} style={{ color: 'var(--lc-accent)' }} />
      </div>

      <div className="flex items-end gap-1.5 h-14">
        {data.map((d) => {
          const isToday = d.day === today
          const barH = d.count > 0 ? Math.max(Math.round((d.count / max) * 52), 6) : 3
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${barH}px`,
                  background: isToday
                    ? 'var(--lc-accent)'
                    : d.count > 0
                      ? '#A5B4FC'
                      : 'var(--lc-border)',
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="flex gap-1.5 mt-1.5">
        {data.map((d) => {
          const isToday = d.day === today
          return (
            <div key={d.day} className="flex-1 text-center">
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? 'var(--lc-accent)' : 'var(--lc-text-muted)',
                }}
              >
                {d.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MonthlyHeatmap({ dailyCounts }: { dailyCounts: Record<string, number> }) {
  const today = new Date().toISOString().slice(0, 10)

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return { iso: d.toISOString().slice(0, 10), date: d }
  })

  const getColor = (count: number) => {
    if (count === 0) return 'var(--lc-border)'
    if (count <= 3) return '#C7D2FE'  // indigo-200
    if (count <= 8) return '#818CF8'  // indigo-400
    return 'var(--lc-accent)'
  }

  // 月が変わった最初のセルにラベルを表示する
  const monthLabels: (string | null)[] = days.map(({ date }, i) => {
    if (i === 0) return `${date.getMonth() + 1}月`
    const prev = days[i - 1].date
    return date.getMonth() !== prev.getMonth() ? `${date.getMonth() + 1}月` : null
  })

  return (
    <div
      style={{
        background: 'var(--lc-surface)',
        border: '1px solid var(--lc-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--lc-text-muted)' }}
        >
          学習カレンダー
          <span className="ml-1.5 normal-case font-normal">（直近30日）</span>
        </h2>
        {/* 凡例 */}
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: '10px', color: 'var(--lc-text-muted)' }}>少</span>
          {[0, 2, 5, 9].map((n) => (
            <div
              key={n}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: getColor(n),
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            />
          ))}
          <span style={{ fontSize: '10px', color: 'var(--lc-text-muted)' }}>多</span>
        </div>
      </div>

      {/* ヒートマップグリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, minmax(0, 1fr))', gap: '3px' }}>
        {days.map(({ iso, date }, i) => {
          const count = dailyCounts[iso] ?? 0
          const isToday = iso === today
          const label = monthLabels[i]
          return (
            <div key={iso} className="flex flex-col items-center gap-0.5">
              {/* 月ラベル */}
              <span
                style={{
                  fontSize: '9px',
                  color: label ? 'var(--lc-text-muted)' : 'transparent',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {label ?? '　'}
              </span>
              {/* セル */}
              <div
                title={`${date.getMonth() + 1}/${date.getDate()}: ${count}回`}
                style={{
                  aspectRatio: '1',
                  width: '100%',
                  borderRadius: '3px',
                  background: getColor(count),
                  border: isToday ? '2px solid var(--lc-accent)' : '1px solid rgba(0,0,0,0.06)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ニックネーム未設定ならオンボーディングへ
  if (!user?.user_metadata?.nickname) redirect('/onboarding')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const now = new Date().toISOString()

  const [logsRes, cardsWithReviewsRes, decksRes, lastLogRes, weakWordsRes, apiUsageRes, imageUsageRes] = await Promise.all([
    supabase
      .from('study_logs')
      .select('is_correct, created_at')
      .eq('user_id', user!.id)
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase
      .from('cards')
      .select('id, deck_id, card_reviews(next_review_at, repetitions)')
      .eq('user_id', user!.id),
    supabase
      .from('decks')
      .select('id, name, cards(count)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('study_logs')
      .select('deck_id')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('card_reviews')
      .select('ease_factor, cards(word, meaning)')
      .eq('user_id', user!.id)
      .gte('repetitions', 1)
      .lte('ease_factor', 2.3)
      .order('ease_factor', { ascending: true })
      .limit(5),
    supabase
      .from('api_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id)
      .eq('endpoint', 'generate-examples')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('api_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id)
      .eq('endpoint', 'generate-image')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  const logs = logsRes.data ?? []
  const cardsWithReviews = cardsWithReviewsRes.data ?? []
  const decks = decksRes.data ?? []
  const weakWords = weakWordsRes.data ?? []
  const apiUsageCount = apiUsageRes.count ?? 0
  const imageUsageCount = imageUsageRes.count ?? 0
  const API_LIMIT = 300
  const IMAGE_LIMIT = 300

  // ── ユーザー表示名（ニックネーム確定済み）
  const userDisplayName = user?.user_metadata?.nickname as string

  // ── ストリーク（今日未復習でも当日中はストリーク継続）
  const studyDates = new Set(logs.map((l) => l.created_at.slice(0, 10)))
  const todayStr = new Date().toISOString().slice(0, 10)
  const streakStart = studyDates.has(todayStr) ? 0 : 1
  let streak = 0
  for (let i = streakStart; ; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (studyDates.has(d.toISOString().slice(0, 10))) { streak++ } else { break }
  }

  // ── デッキ別：復習数 & 習得数（未レビューカードも復習待ちに含む）
  const dueByDeckId: Record<string, number> = {}
  const learnedByDeckId: Record<string, number> = {}
  let dueCount = 0
  cardsWithReviews.forEach((card) => {
    const review = (card.card_reviews as Array<{ next_review_at: string; repetitions: number }> | null)?.[0]
    // 未レビュー OR next_review_at が過去 → 復習待ち
    if (!review || review.next_review_at <= now) {
      dueCount++
      dueByDeckId[card.deck_id] = (dueByDeckId[card.deck_id] ?? 0) + 1
    }
    if (review && review.repetitions >= 1) {
      learnedByDeckId[card.deck_id] = (learnedByDeckId[card.deck_id] ?? 0) + 1
    }
  })

  // ── 次の復習時刻
  const futureReviewDates = cardsWithReviews
    .map((card) => (card.card_reviews as Array<{ next_review_at: string }> | null)?.[0]?.next_review_at)
    .filter((d): d is string => !!d && d > now)
  const nextReviewIso = futureReviewDates.length > 0
    ? futureReviewDates.reduce((min, d) => d < min ? d : min, futureReviewDates[0])
    : null

  // ── 統計
  const weeklyReviewCount = logs.filter((l) => l.created_at >= sevenDaysAgo.toISOString()).length
  const lastWeekCount = logs.filter((l) => {
    const d = l.created_at
    return d >= fourteenDaysAgo.toISOString() && d < sevenDaysAgo.toISOString()
  }).length
  const weekTrend = lastWeekCount > 0
    ? Math.round(((weeklyReviewCount - lastWeekCount) / lastWeekCount) * 100)
    : null

  const learnedCount = Object.values(learnedByDeckId).reduce((sum, n) => sum + n, 0)
  const totalCards = decks.reduce(
    (sum, d) => sum + ((d.cards as unknown as { count: number }[])[0]?.count ?? 0),
    0,
  )

  // ── 週間アクティビティデータ（直近7日）
  const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { day: d.toISOString().slice(0, 10), label: DAY_LABELS[d.getDay()], count: 0 }
  })
  logs.forEach((l) => {
    const item = weeklyData.find((d) => d.day === l.created_at.slice(0, 10))
    if (item) item.count++
  })

  // ── 月間ヒートマップデータ（直近30日）
  const dailyCounts: Record<string, number> = {}
  logs.forEach((l) => {
    const day = l.created_at.slice(0, 10)
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1
  })

  // ── 続きから再開
  const lastStudiedDeckId = lastLogRes.data?.deck_id ?? null
  const lastStudiedDeck = lastStudiedDeckId ? decks.find((d) => d.id === lastStudiedDeckId) : null
  const canResume = !!(lastStudiedDeckId && (dueByDeckId[lastStudiedDeckId] ?? 0) > 0)

  return (
    <div className="min-h-screen" style={{ background: 'var(--lc-bg)' }}>
      {/* ─── Header ─── */}
      <header style={{ background: 'var(--lc-surface)', borderBottom: '1px solid var(--lc-border)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--lc-text-primary)' }}>
            NeoVocab
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/decks"
              className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: 'var(--lc-text-secondary)' }}
            >
              デッキ一覧
            </Link>
            <Link
              href="/settings"
              className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: 'var(--lc-text-muted)' }}
              title="設定"
            >
              <Settings size={16} />
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
                style={{ color: 'var(--lc-text-muted)' }}
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-5">

        {/* ─── ウェルカムバナー ─── */}
        <div
          className="rounded-xl px-6 py-5"
          style={{ background: 'linear-gradient(135deg, var(--lc-accent) 0%, #7C3AED 100%)' }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                おかえりなさい
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-white">{userDisplayName}</h1>
                {streak > 0 && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    <Flame size={11} style={{ color: '#FCD34D' }} />
                    {streak}日連続
                  </span>
                )}
                {dueCount === 0 && totalCards > 0 && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    <CheckCircle2 size={11} />
                    今日の復習完了
                  </span>
                )}
              </div>
              {dueCount > 0 && (
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {dueCount}枚の復習が待っています
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {canResume && lastStudiedDeck && (
                <Link
                  href={`/decks/${lastStudiedDeckId}/study`}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  <RotateCcw size={13} />
                  再開
                </Link>
              )}
              {dueCount > 0 ? (
                <Link
                  href="/study"
                  className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: 'white', color: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
                >
                  今すぐ復習
                  <ArrowRight size={14} />
                </Link>
              ) : nextReviewIso ? (
                <div
                  className="text-sm px-4 py-2.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 'var(--radius-md)' }}
                >
                  次は{formatTimeUntil(nextReviewIso)}
                </div>
              ) : (
                <Link
                  href="/decks/new"
                  className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: 'white', color: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
                >
                  <Plus size={14} />
                  デッキを作る
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ─── 4列スタットカード ─── */}
        {decks.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="復習待ち"
              value={dueCount}
              unit="枚"
              sub={dueCount > 0 ? '今すぐ復習できます' : '今日は完了です'}
              subColor={dueCount > 0 ? 'var(--lc-accent)' : 'var(--lc-success)'}
              iconEl={<Brain size={15} />}
              accentColor="var(--lc-accent)"
            />
            <StatCard
              label="学習ストリーク"
              value={streak}
              unit="日連続"
              sub={streak > 0 ? 'このまま続けよう' : '今日から始めよう'}
              iconEl={<Flame size={15} />}
              accentColor="var(--lc-streak)"
            />
            <StatCard
              label="総習得数"
              value={learnedCount}
              unit={`/ ${totalCards}枚`}
              sub={`${totalCards > 0 ? Math.round((learnedCount / totalCards) * 100) : 0}% 習得済み`}
              iconEl={<Layers size={15} />}
              accentColor="var(--lc-success)"
            />
            <StatCard
              label="今週のレビュー"
              value={weeklyReviewCount}
              unit="回"
              sub="直近7日間"
              iconEl={<TrendingUp size={15} />}
              accentColor="var(--lc-accent)"
              trend={weekTrend}
            />
          </div>
        )}

        {/* ─── 小テスト ─── */}
        {totalCards >= 4 && (
          <div
            className="rounded-xl px-6 py-5"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PenLine size={14} style={{ color: 'rgba(255,255,255,0.85)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    小テスト
                  </p>
                </div>
                <p className="text-xl font-bold text-white">
                  {totalCards}枚から出題
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  10問 • 4択 • 即時採点
                </p>
              </div>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90 shrink-0"
                style={{ background: 'white', color: '#D97706', borderRadius: 'var(--radius-md)' }}
              >
                テストを始める
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* ─── デッキ進捗 (2/3) + 右カラム (1/3) ─── */}
        {decks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* デッキ進捗 */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--lc-text-muted)' }}
                >
                  デッキ進捗
                </h2>
                {decks.length > 5 && (
                  <Link
                    href="/decks"
                    className="text-xs font-medium transition-colors hover:opacity-70"
                    style={{ color: 'var(--lc-accent)' }}
                  >
                    すべてのデッキを見る →
                  </Link>
                )}
              </div>
              <div
                style={{
                  background: 'var(--lc-surface)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}
              >
                {decks.slice(0, 5).map((deck, i) => {
                  const total = (deck.cards as unknown as { count: number }[])[0]?.count ?? 0
                  const learned = learnedByDeckId[deck.id] ?? 0
                  const due = dueByDeckId[deck.id] ?? 0
                  const pct = total > 0 ? Math.round((learned / total) * 100) : 0
                  const displayCount = Math.min(decks.length, 5)

                  return (
                    <div
                      key={deck.id}
                      className="px-5 py-4"
                      style={{
                        borderBottom: i < displayCount - 1 ? '1px solid var(--lc-border)' : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-sm font-medium" style={{ color: 'var(--lc-text-primary)' }}>
                          {deck.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs tabular-nums" style={{ color: 'var(--lc-text-muted)' }}>
                            {learned} / {total}枚
                          </span>
                          {due > 0 && (
                            <Link
                              href={`/decks/${deck.id}/study`}
                              className="text-xs font-semibold text-white px-2.5 py-1 transition-opacity hover:opacity-90"
                              style={{
                                background: 'var(--lc-accent)',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              {due}枚復習
                            </Link>
                          )}
                          {pct === 100 && (
                            <CheckCircle2 size={14} style={{ color: 'var(--lc-success)' }} />
                          )}
                        </div>
                      </div>
                      <div
                        className="h-1.5 w-full rounded-full overflow-hidden"
                        style={{ background: 'var(--lc-border)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? 'var(--lc-success)' : 'var(--lc-accent)',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 右カラム: 週間アクティビティ + 苦手な単語 */}
            <div className="space-y-4">
              <WeeklyActivityChart data={weeklyData} total={weeklyReviewCount} />

              {weakWords.length > 0 && (
                <div>
                  <h2
                    className="text-xs font-semibold uppercase tracking-widest mb-3"
                    style={{ color: 'var(--lc-text-muted)' }}
                  >
                    苦手な単語
                  </h2>
                  <div
                    style={{
                      background: 'var(--lc-surface)',
                      border: '1px solid var(--lc-border)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                    }}
                  >
                    {weakWords.map((r, i) => {
                      const card = r.cards as { word: string; meaning: string } | null
                      if (!card) return null
                      const badge = easeBadge(r.ease_factor)
                      return (
                        <div
                          key={i}
                          className="px-4 py-3.5"
                          style={{
                            borderBottom: i < weakWords.length - 1 ? '1px solid var(--lc-border)' : 'none',
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: 'var(--lc-text-primary)' }}>
                                {card.word}
                              </p>
                              <p className="text-xs truncate mt-0.5" style={{ color: 'var(--lc-text-muted)' }}>
                                {card.meaning}
                              </p>
                            </div>
                            <span
                              className="text-xs font-medium px-2 py-0.5 shrink-0 mt-0.5"
                              style={{
                                background: badge.bg,
                                color: badge.color,
                                borderRadius: 'var(--radius-full)',
                              }}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ─── 月間ヒートマップ ─── */}
        {decks.length > 0 && (
          <MonthlyHeatmap dailyCounts={dailyCounts} />
        )}

        {/* ─── AI使用状況 ─── */}
        <div
          className="px-5 py-4 space-y-4"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {/* 例文生成 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--lc-text-muted)' }}>
                今月のAI例文生成
              </span>
              <span className="text-xs tabular-nums" style={{ color: 'var(--lc-text-muted)' }}>
                {apiUsageCount} / {API_LIMIT}回
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--lc-border)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(Math.round((apiUsageCount / API_LIMIT) * 100), 100)}%`,
                  background: apiUsageCount >= API_LIMIT
                    ? 'var(--lc-danger)'
                    : apiUsageCount >= API_LIMIT * 0.8
                      ? 'var(--lc-streak)'
                      : 'var(--lc-accent)',
                }}
              />
            </div>
            {apiUsageCount >= API_LIMIT && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--lc-danger)' }}>
                今月の上限に達しました。来月また使えます。
              </p>
            )}
          </div>

          {/* 画像生成 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--lc-text-muted)' }}>
                今月のAI画像生成
              </span>
              <span className="text-xs tabular-nums" style={{ color: 'var(--lc-text-muted)' }}>
                {imageUsageCount} / {IMAGE_LIMIT}回
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--lc-border)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(Math.round((imageUsageCount / IMAGE_LIMIT) * 100), 100)}%`,
                  background: imageUsageCount >= IMAGE_LIMIT
                    ? 'var(--lc-danger)'
                    : imageUsageCount >= IMAGE_LIMIT * 0.8
                      ? 'var(--lc-streak)'
                      : 'var(--lc-accent)',
                }}
              />
            </div>
            {imageUsageCount >= IMAGE_LIMIT && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--lc-danger)' }}>
                今月の上限に達しました。来月また使えます。
              </p>
            )}
          </div>
        </div>

        {/* ─── デッキなし空状態 ─── */}
        {decks.length === 0 && (
          <div
            className="py-16 text-center"
            style={{
              background: 'var(--lc-surface)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <BookOpen size={28} className="mx-auto mb-3" style={{ color: 'var(--lc-border-strong)' }} />
            <p className="text-sm mb-5" style={{ color: 'var(--lc-text-muted)' }}>デッキがまだありません</p>
            <Link
              href="/decks/new"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 transition-opacity hover:opacity-90"
              style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
            >
              <Plus size={14} />
              最初のデッキを作る
            </Link>
          </div>
        )}

      </main>
    </div>
  )
}
