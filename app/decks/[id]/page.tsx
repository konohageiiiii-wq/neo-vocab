import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CardList from '@/components/CardList'
import DeleteDeckButton from '@/components/DeleteDeckButton'

const LANGUAGE_LABEL: Record<string, string> = {
  en: '英語',
  es: 'スペイン語',
}

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [deckRes, cardsRes] = await Promise.all([
    supabase.from('decks').select('*').eq('id', id).single(),
    supabase.from('cards').select('*').eq('deck_id', id).order('created_at', { ascending: false }),
  ])

  if (deckRes.error || !deckRes.data) notFound()

  const deck = deckRes.data
  const isOwner = deck.user_id === user?.id

  // プライベートデッキは所有者のみアクセス可能
  if (!deck.is_public && !isOwner) notFound()

  const cards = cardsRes.data ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* パンくず */}
      <div className="mb-6">
        <Link href="/decks" className="text-sm text-gray-500 hover:text-gray-700">
          ← デッキ一覧に戻る
        </Link>
      </div>

      {/* デッキ情報 */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{deck.name}</h1>
          <div className="flex gap-2 shrink-0">
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              {LANGUAGE_LABEL[deck.language] ?? deck.language}
            </span>
            {deck.is_public && (
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                公開
              </span>
            )}
          </div>
        </div>
        {deck.description && (
          <p className="text-gray-500 text-sm">{deck.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">{cards.length} 枚</p>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href={`/decks/${id}/study`}
          className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          復習開始
        </Link>
        {isOwner && (
          <>
            <Link
              href={`/decks/${id}/cards/new`}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              + カード追加
            </Link>
            <DeleteDeckButton deckId={id} />
          </>
        )}
      </div>

      {/* カード一覧 */}
      <div className="bg-white rounded-2xl border border-gray-200 px-6">
        <CardList cards={cards} isOwner={isOwner} deckId={id} />
      </div>
    </div>
  )
}
