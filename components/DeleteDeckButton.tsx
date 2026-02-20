'use client'

import { deleteDeck } from '@/app/decks/actions'

export default function DeleteDeckButton({ deckId }: { deckId: string }) {
  async function handleDelete() {
    if (!confirm('このデッキを削除しますか？')) return
    await deleteDeck(deckId)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
    >
      削除
    </button>
  )
}
