import Link from 'next/link'

export default function DeckNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-200 mb-4">404</p>
        <p className="text-lg font-medium text-gray-700 mb-2">デッキが見つかりません</p>
        <p className="text-sm text-gray-400 mb-8">
          存在しないか、アクセス権限がありません
        </p>
        <Link
          href="/decks"
          className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          デッキ一覧へ戻る
        </Link>
      </div>
    </div>
  )
}
