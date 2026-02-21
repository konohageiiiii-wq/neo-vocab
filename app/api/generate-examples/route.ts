import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAME: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
}

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const VALID_LANGUAGES = ['en', 'es']

// コスト根拠: claude-sonnet-4-5 ($3/$15 per M tokens)
// 1回あたり最悪 0.64円 → 月300円上限 = 469回
// 安全マージンを取り月450回・日15回に設定
const LIMIT_PER_MONTH  = 450
const LIMIT_PER_DAY    = 15
const LIMIT_PER_MINUTE = 5

export async function POST(request: Request) {
  // 認証チェック
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── レートリミット ──────────────────────────────────
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const oneDayAgo     = new Date(now.getTime() -      24 * 60 * 60 * 1000).toISOString()
  const oneMinuteAgo  = new Date(now.getTime() -           60 * 1000).toISOString()

  const [monthRes, dayRes, minRes] = await Promise.all([
    supabase
      .from('api_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('endpoint', 'generate-examples')
      .gte('created_at', thirtyDaysAgo),
    supabase
      .from('api_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('endpoint', 'generate-examples')
      .gte('created_at', oneDayAgo),
    supabase
      .from('api_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('endpoint', 'generate-examples')
      .gte('created_at', oneMinuteAgo),
  ])

  if ((monthRes.count ?? 0) >= LIMIT_PER_MONTH) {
    return NextResponse.json(
      { error: '月間の例文生成上限（450回）に達しました。来月また試してください。' },
      { status: 429 }
    )
  }
  if ((dayRes.count ?? 0) >= LIMIT_PER_DAY) {
    return NextResponse.json(
      { error: '1日の例文生成上限（15回）に達しました。明日また試してください。' },
      { status: 429 }
    )
  }
  if ((minRes.count ?? 0) >= LIMIT_PER_MINUTE) {
    return NextResponse.json(
      { error: 'リクエストが多すぎます。少し待ってから再試行してください。' },
      { status: 429 }
    )
  }
  // ───────────────────────────────────────────────────

  const { word, part_of_speech, level, language } = await request.json()

  // 入力バリデーション
  if (!word?.trim() || !language) {
    return NextResponse.json({ error: 'word and language are required' }, { status: 400 })
  }
  if (word.length > 100) {
    return NextResponse.json({ error: 'word is too long' }, { status: 400 })
  }
  if (!VALID_LANGUAGES.includes(language)) {
    return NextResponse.json({ error: 'invalid language' }, { status: 400 })
  }
  if (level && !VALID_LEVELS.includes(level)) {
    return NextResponse.json({ error: 'invalid level' }, { status: 400 })
  }

  // 使用記録を先に挿入（Claude API 呼び出し前にカウント）
  await supabase.from('api_usage').insert({
    user_id:  user.id,
    endpoint: 'generate-examples',
  })

  const langName = LANGUAGE_NAME[language] ?? language
  // part_of_speech はプロンプトに直接埋め込まれるため英数字・スペース・ハイフンのみ許可
  const sanitizedPos = part_of_speech
    ? part_of_speech.replace(/[^a-zA-Z0-9\s\-]/g, '').trim().slice(0, 30)
    : ''
  const posHint   = sanitizedPos ? ` (${sanitizedPos})` : ''
  const levelHint = level ? ` at CEFR level ${level}` : ''

  const prompt = `Generate exactly 1 natural example sentence in ${langName} using the word "${word}"${posHint}${levelHint}.

Requirements:
- The sentence must use the word "${word}" naturally
- The sentence should be appropriate for CEFR level ${level ?? 'B1'}
- Return ONLY a JSON array of 1 string, no explanation
- Example format: ["Sentence 1."]`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  let examples: string[]
  try {
    const match = text.match(/\[[\s\S]*\]/)
    examples = JSON.parse(match ? match[0] : text)
    if (!Array.isArray(examples) || examples.length !== 1) throw new Error()
  } catch {
    return NextResponse.json({ error: '例文の生成に失敗しました。再度お試しください。' }, { status: 500 })
  }

  return NextResponse.json({ examples })
}
