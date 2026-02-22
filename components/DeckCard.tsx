import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import { Tables } from '@/types/database.types'

type Deck = Tables<'decks'> & { card_count?: number; is_owner?: boolean }

const LANGUAGE_META: Record<string, {
  label: string
  borderColor: string
  bg: string
  badgeBg: string
  badgeColor: string
}> = {
  en: {
    label: 'English',
    borderColor: 'var(--lc-accent)',
    bg: '#F5F7FF',
    badgeBg: 'var(--lc-accent-light)',
    badgeColor: 'var(--lc-accent)',
  },
  es: {
    label: 'Español',
    borderColor: '#F59E0B',
    bg: '#FFFBEB',
    badgeBg: '#FFF7ED',
    badgeColor: '#D97706',
  },
}

const FALLBACK_META = {
  label: '?',
  borderColor: 'var(--lc-border-strong)',
  bg: 'var(--lc-bg)',
  badgeBg: 'var(--lc-bg)',
  badgeColor: 'var(--lc-text-muted)',
}

export default function DeckCard({ deck }: { deck: Deck }) {
  const meta = LANGUAGE_META[deck.language] ?? { ...FALLBACK_META, label: deck.language }

  return (
    <Link
      href={`/decks/${deck.id}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-75"
      style={{
        background: meta.bg,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--lc-border)',
        borderLeft: `3px solid ${meta.borderColor}`,
        padding: '14px 12px 14px 14px',
      }}
    >
      {/* 言語バッジ */}
      <span
        className="shrink-0 text-xs font-bold px-2 py-1"
        style={{
          background: meta.badgeBg,
          color: meta.badgeColor,
          borderRadius: 'var(--radius-sm)',
          minWidth: '52px',
          textAlign: 'center',
        }}
      >
        {meta.label}
      </span>

      {/* デッキ名・説明 */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm leading-snug truncate"
          style={{ color: 'var(--lc-text-primary)' }}
        >
          {deck.name}
        </p>
        {deck.description ? (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--lc-text-muted)' }}>
            {deck.description}
          </p>
        ) : (
          <div className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--lc-text-muted)' }}>
            <BookOpen size={11} />
            <span className="text-xs tabular-nums">{deck.card_count ?? 0}枚</span>
            {deck.is_public && !deck.is_owner && (
              <span
                className="ml-1 text-xs px-1.5 py-0"
                style={{
                  background: 'var(--lc-bg)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--lc-text-muted)',
                }}
              >
                公開
              </span>
            )}
          </div>
        )}
        {deck.description && (
          <div className="flex items-center gap-1 mt-1" style={{ color: 'var(--lc-text-muted)' }}>
            <BookOpen size={11} />
            <span className="text-xs tabular-nums">{deck.card_count ?? 0}枚</span>
          </div>
        )}
      </div>

      {/* 矢印 */}
      <ChevronRight size={15} className="shrink-0" style={{ color: 'var(--lc-text-muted)' }} />
    </Link>
  )
}
