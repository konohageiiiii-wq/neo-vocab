'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import DeckCard from './DeckCard'
import { Tables } from '@/types/database.types'

type DeckWithCount = Tables<'decks'> & { card_count: number; is_owner: boolean }
type SortKey = 'created' | 'count' | 'name'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'created', label: '作成日順' },
  { key: 'count', label: 'カード枚数順' },
  { key: 'name', label: '名前順' },
]

function sortDecks(decks: DeckWithCount[], key: SortKey): DeckWithCount[] {
  return [...decks].sort((a, b) => {
    if (key === 'count') return b.card_count - a.card_count
    if (key === 'name') return a.name.localeCompare(b.name, 'ja')
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export default function DeckListSorted({ decks }: { decks: DeckWithCount[] }) {
  const [sort, setSort] = useState<SortKey>('created')
  const [query, setQuery] = useState('')

  const sorted = sortDecks(decks, sort)
  const filtered = query.trim()
    ? sorted.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : sorted

  return (
    <div>
      {/* 検索 + ソートコントロール */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        {/* 検索インプット */}
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--lc-text-muted)' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="デッキ名で検索..."
            className="w-full pl-8 pr-3 py-1.5 text-xs transition-colors focus:outline-none"
            style={{
              background: 'var(--lc-bg)',
              border: '1px solid var(--lc-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--lc-text-primary)',
            }}
          />
        </div>

        {/* ソートボタン */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>並び順：</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className="text-xs px-3 py-1.5 font-medium transition-colors cursor-pointer"
              style={{
                borderRadius: 'var(--radius-full)',
                background: sort === opt.key ? 'var(--lc-accent)' : 'var(--lc-bg)',
                color: sort === opt.key ? '#FFFFFF' : 'var(--lc-text-muted)',
                border: sort === opt.key ? 'none' : '1px solid var(--lc-border)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: 'var(--lc-text-muted)' }}>
          「{query}」に一致するデッキが見つかりません
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </div>
  )
}
