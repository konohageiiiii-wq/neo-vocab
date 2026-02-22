'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { LayoutList, LayoutGrid, BookOpen } from 'lucide-react'
import { Tables } from '@/types/database.types'
import { deleteCard } from '@/lib/actions/card-actions'

type Card = Tables<'cards'>


export default function CardList({ cards, isOwner, deckId }: { cards: Card[]; isOwner: boolean; deckId: string }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const handleDelete = (card: Card) => {
    if (!confirm(`「${card.word}」を削除しますか？`)) return
    setDeletingId(card.id)
    startTransition(async () => {
      await deleteCard(card.id)
      setDeletingId(null)
      if (selectedCard?.id === card.id) setSelectedCard(null)
    })
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-base mb-1">カードがまだありません</p>
        <p className="text-sm">「カード追加」から単語を登録しましょう</p>
      </div>
    )
  }

  return (
    <>
      {/* ビュー切替トグル */}
      <div className="flex items-center justify-end mb-4 gap-1">
        <button
          onClick={() => setViewMode('list')}
          className="p-1.5 rounded transition-colors"
          style={{
            color: viewMode === 'list' ? 'var(--lc-accent)' : 'var(--lc-text-muted)',
            background: viewMode === 'list' ? 'var(--lc-accent-light)' : 'transparent',
          }}
          title="リスト表示"
        >
          <LayoutList size={16} />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className="p-1.5 rounded transition-colors"
          style={{
            color: viewMode === 'grid' ? 'var(--lc-accent)' : 'var(--lc-text-muted)',
            background: viewMode === 'grid' ? 'var(--lc-accent-light)' : 'transparent',
          }}
          title="グリッド表示"
        >
          <LayoutGrid size={16} />
        </button>
      </div>

      {/* リストビュー */}
      {viewMode === 'list' && (
        <div className="divide-y divide-gray-100">
          {cards.map((card) => (
            <div
              key={card.id}
              className="py-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors"
              onClick={() => setSelectedCard(card)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base font-semibold text-gray-900">{card.word}</span>
                  {card.reading && (
                    <span className="text-sm text-gray-400">[{card.reading}]</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{card.meaning}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isOwner && (
                  <>
                    <Link
                      href={`/decks/${deckId}/cards/${card.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: 'var(--lc-accent)' }}
                    >
                      編集
                    </Link>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(card) }}
                      disabled={deletingId === card.id || isPending}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors px-2 py-1 rounded"
                    >
                      {deletingId === card.id ? '削除中...' : '削除'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* グリッドビュー */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
              style={{
                background: 'var(--lc-surface)',
                border: '1px solid var(--lc-border)',
                borderRadius: 'var(--radius-md)',
              }}
              onClick={() => setSelectedCard(card)}
            >
              {/* 画像エリア */}
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={`${card.word} のイメージ`}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div
                  className="w-full aspect-square flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)' }}
                >
                  <BookOpen size={24} style={{ color: 'var(--lc-border-strong)' }} />
                </div>
              )}
              {/* テキストエリア */}
              <div className="px-3 py-2.5">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--lc-text-primary)' }}>
                  {card.word}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--lc-text-muted)' }}>
                  {card.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* カード詳細モーダル */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCard.word}</h2>
                {selectedCard.reading && (
                  <p className="text-sm text-gray-400 mt-0.5">[{selectedCard.reading}]</p>
                )}
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* モーダル本文 */}
            <div className="px-6 pb-6 space-y-4">
              {/* 画像 */}
              {selectedCard.image_url && (
                <img
                  src={selectedCard.image_url}
                  alt={`${selectedCard.word} のイメージ`}
                  className="w-full h-48 object-cover"
                  style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--lc-border)' }}
                />
              )}


              <p className="text-base text-gray-700 leading-relaxed">{selectedCard.meaning}</p>

              {selectedCard.examples && selectedCard.examples.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">例文</p>
                  {selectedCard.examples.map((ex, i) => {
                    const [sentence, translation] = ex.split('\n')
                    return (
                      <div key={i}>
                        <p className="text-sm text-gray-600 leading-relaxed">{sentence}</p>
                        {translation && (
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{translation}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {selectedCard.memo && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">メモ</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedCard.memo}</p>
                </div>
              )}
            </div>

            {/* モーダルフッター */}
            {isOwner && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/decks/${deckId}/cards/${selectedCard.id}/edit`}
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--lc-accent)' }}
                >
                  編集する
                </Link>
                <button
                  onClick={() => handleDelete(selectedCard)}
                  disabled={deletingId === selectedCard.id || isPending}
                  className="text-sm text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                >
                  {deletingId === selectedCard.id ? '削除中...' : 'このカードを削除'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
