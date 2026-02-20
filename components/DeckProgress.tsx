type DeckProgressData = {
  id: string
  name: string
  total: number
  learned: number
}

export default function DeckProgress({ decks }: { decks: DeckProgressData[] }) {
  if (decks.length === 0) {
    return <p className="text-sm text-gray-400">デッキがありません</p>
  }

  return (
    <div className="space-y-4">
      {decks.map((deck) => {
        const pct = deck.total === 0 ? 0 : Math.round((deck.learned / deck.total) * 100)
        return (
          <div key={deck.id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 font-medium truncate">{deck.name}</span>
              <span className="text-gray-400 shrink-0 ml-2">{deck.learned} / {deck.total} 枚</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gray-900 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
