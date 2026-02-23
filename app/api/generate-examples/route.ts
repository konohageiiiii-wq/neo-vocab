import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAME: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
}

const VALID_LANGUAGES = ['en', 'es']

const LIMIT_PER_MONTH = 300

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

  const monthRes = await supabase
    .from('api_usage')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('endpoint', 'generate-examples')
    .gte('created_at', thirtyDaysAgo)

  if ((monthRes.count ?? 0) >= LIMIT_PER_MONTH) {
    return NextResponse.json(
      { error: '月間の例文生成上限（300回）に達しました。来月また試してください。' },
      { status: 429 }
    )
  }
  // ───────────────────────────────────────────────────

  const { word, language } = await request.json()

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

  // 使用記録を先に挿入（Claude API 呼び出し前にカウント）
  await supabase.from('api_usage').insert({
    user_id:  user.id,
    endpoint: 'generate-examples',
  })

  const langName = LANGUAGE_NAME[language] ?? language

  // ユーザー入力を XML タグで囲みプロンプトインジェクションを防止
  const prompt = `Generate exactly 1 natural example sentence in ${langName} using the word below, and provide its Japanese translation.

<word>${word}</word>

Requirements:
- The sentence must use the word naturally
- Return ONLY a JSON array with 1 object containing "sentence" and "translation" keys, no explanation
- Example format: [{"sentence": "Sentence here.", "translation": "日本語訳"}]`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  let examples: string[]
  try {
    const match = text.match(/\[[\s\S]*\]/)
    const parsed = JSON.parse(match ? match[0] : text)
    if (!Array.isArray(parsed) || parsed.length !== 1) throw new Error()
    const item = parsed[0]
    if (typeof item === 'string') {
      examples = [item]
    } else {
      examples = [`${item.sentence}\n${item.translation}`]
    }
  } catch {
    return NextResponse.json({ error: '例文の生成に失敗しました。再度お試しください。' }, { status: 500 })
  }

  return NextResponse.json({ examples })
}
