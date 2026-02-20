import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Tables } from '@/types/database.types'

type Deck = Tables<'decks'> & { card_count?: number; is_owner?: boolean }

const LANGUAGE_META: Record<string, { label: string; gradient: string; textColor: string }> = {
  en: {
    label: 'English',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    textColor: '#BFDBFE',
  },
  es: {
    label: 'Español',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    textColor: '#FED7AA',
  },
}

const FALLBACK_META = {
  label: '',
  gradient: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)',
  textColor: '#E5E7EB',
}

export default function DeckCard({ deck }: { deck: Deck }) {
  const meta = LANGUAGE_META[deck.language] ?? { ...FALLBACK_META, label: deck.language }

  return (
    <Link
      href={`/decks/${deck.id}`}
      className="block transition-shadow hover:shadow-md overflow-hidden"
      style={{
        background: 'var(--lc-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--lc-border)',
      }}
    >
      {/* カバー */}
      <div
        className="h-20 flex items-end px-4 pb-3"
        style={{ background: meta.gradient }}
      >
        <div className="flex items-center justify-between w-full">
          <span
            className="text-xs font-semibold px-2 py-0.5"
            style={{
              background: 'rgba(0,0,0,0.25)',
              color: meta.textColor,
              borderRadius: 'var(--radius-full)',
            }}
          >
            {meta.label}
          </span>
          {deck.is_public && !deck.is_owner && (
            <span
              className="text-xs font-medium px-2 py-0.5"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-full)',
              }}
            >
              公開
            </span>
          )}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="px-4 py-3">
        <h3 className="font-semibold leading-snug mb-1" style={{ color: 'var(--lc-text-primary)' }}>
          {deck.name}
        </h3>

        {deck.description && (
          <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--lc-text-muted)' }}>
            {deck.description}
          </p>
        )}

        <div className="flex items-center gap-1.5" style={{ color: 'var(--lc-text-muted)' }}>
          <BookOpen size={13} />
          <span className="text-xs">{deck.card_count ?? 0} 枚</span>
        </div>
      </div>
    </Link>
  )
}
