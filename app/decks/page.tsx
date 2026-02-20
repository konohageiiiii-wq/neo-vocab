import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeckListSorted from '@/components/DeckListSorted'
import DeckCard from '@/components/DeckCard'
import { Tables } from '@/types/database.types'

type DeckWithCount = Tables<'decks'> & { card_count: number; is_owner: boolean }

export default async function DecksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [myDecksRes, publicDecksRes] = await Promise.all([
    supabase
      .from('decks')
      .select('*, cards(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('decks')
      .select('*, cards(count)')
      .eq('is_public', true)
      .neq('user_id', user!.id)
      .order('created_at', { ascending: false }),
  ])

  const toDecks = (rows: typeof myDecksRes['data'], isOwner: boolean): DeckWithCount[] =>
    (rows ?? []).map((d) => ({
      ...d,
      card_count: (d.cards as unknown as { count: number }[])[0]?.count ?? 0,
      is_owner: isOwner,
    }))

  const myDecks = toDecks(myDecksRes.data, true)
  const publicDecks = toDecks(publicDecksRes.data, false)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← ダッシュボード
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">マイデッキ</h1>
        </div>
        <Link
          href="/decks/new"
          className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          + 新規デッキ作成
        </Link>
      </div>

      {/* 自分のデッキ */}
      {myDecks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">デッキがまだありません</p>
          <p className="text-sm">「新規デッキ作成」から最初のデッキを作りましょう</p>
        </div>
      ) : (
        <div className="mb-12">
          <DeckListSorted decks={myDecks} />
        </div>
      )}

      {/* 公開デッキ */}
      {publicDecks.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4">公開デッキ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
