import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { ArrowRight, Tag, BookOpen } from 'lucide-react'

const DARK = '#0F172A'
const DARK_MUTED = '#94A3B8'
const DARK_SUB = '#64748B'

export const metadata: Metadata = {
  title: 'ブログ | NeoVocab',
  description: '英語・スペイン語学習のヒントや、SM-2アルゴリズム・AI活用法を紹介するNeoVocabブログ。',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'ブログ | NeoVocab',
    description: '英語・スペイン語学習のヒントや、SM-2アルゴリズム・AI活用法を紹介するNeoVocabブログ。',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen" style={{ background: 'var(--lc-bg)' }}>

      {/* Nav */}
      <nav style={{ background: DARK, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            NeoVocab
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-medium px-4 py-2 transition-colors"
              style={{ color: DARK_MUTED }}
            >
              ログイン
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold text-white px-4 py-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
            >
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header style={{ background: DARK, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold mb-6 px-3 py-1.5"
            style={{
              background: 'rgba(79,70,229,0.15)',
              color: '#A5B4FC',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            <BookOpen size={12} />
            学習ブログ
          </div>
          <h1
            className="font-black mb-4"
            style={{ color: '#F8FAFC', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            語学学習をもっと科学的に
          </h1>
          <p style={{ color: DARK_MUTED }} className="text-lg max-w-xl mx-auto">
            英語・スペイン語の学び方、SM-2アルゴリズム、AI活用法を発信します。
          </p>
        </div>
      </header>

      {/* Post grid */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--lc-text-muted)' }}>
            記事は近日公開予定です。
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
                style={{
                  background: 'var(--lc-surface)',
                  border: '1px solid var(--lc-border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
              >
                {/* Thumbnail */}
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--lc-border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1"
                          style={{
                            background: 'var(--lc-accent-light)',
                            color: 'var(--lc-accent)',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2
                    className="font-bold text-lg mb-2 leading-snug group-hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--lc-text-primary)' }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: 'var(--lc-text-muted)' }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <time
                      dateTime={post.date}
                      className="text-xs"
                      style={{ color: 'var(--lc-text-muted)' }}
                    >
                      {post.date.replace(/-/g, '/')}
                    </time>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: 'var(--lc-accent)' }}
                    >
                      続きを読む
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--lc-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-bold" style={{ color: 'var(--lc-text-primary)' }}>NeoVocab</span>
          <span className="text-xs" style={{ color: 'var(--lc-text-muted)' }}>© 2026 NeoVocab</span>
          <Link href="/auth" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--lc-text-muted)' }}>
            ログイン / 新規登録
          </Link>
        </div>
      </footer>

    </div>
  )
}
