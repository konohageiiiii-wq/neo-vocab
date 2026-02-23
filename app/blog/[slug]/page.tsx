import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { ArrowRight, Tag, ArrowLeft, BookOpen } from 'lucide-react'

const DARK = '#0F172A'
const DARK_MUTED = '#94A3B8'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neo-vocab.vercel.app'

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: `${post.title} | NeoVocab`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [{ url: `${SITE_URL}${post.image}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

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

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: 'var(--lc-accent)' }}
        >
          <ArrowLeft size={14} />
          ブログ一覧に戻る
        </Link>

        {/* Hero image */}
        {post.image && (
          <div
            className="w-full mb-8 overflow-hidden"
            style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-xl)', background: 'var(--lc-border)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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
        <h1
          className="font-black mb-3 leading-tight"
          style={{ color: 'var(--lc-text-primary)', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
        >
          {post.title}
        </h1>

        {/* Date */}
        <time
          dateTime={post.date}
          className="block text-sm mb-10"
          style={{ color: 'var(--lc-text-muted)' }}
        >
          {post.date.replace(/-/g, '/')}
        </time>

        {/* MDX content */}
        <article className="prose-blog">
          <MDXRemote source={post.content} />
        </article>

        {/* CTA */}
        <div
          className="mt-16 p-8 text-center"
          style={{
            background: 'var(--lc-surface)',
            border: '1px solid var(--lc-border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold mb-4 px-3 py-1.5"
            style={{
              background: 'var(--lc-accent-light)',
              color: 'var(--lc-accent)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <BookOpen size={12} />
            NeoVocab
          </div>
          <h2 className="text-xl font-black mb-3" style={{ color: 'var(--lc-text-primary)' }}>
            今日から、科学的に語学を学ぼう。
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--lc-text-muted)' }}>
            AI が例文・画像を自動生成。SM-2 が最適なタイミングで復習を促す。登録30秒・完全無料。
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-3 transition-opacity hover:opacity-90"
            style={{ background: 'var(--lc-accent)', borderRadius: 'var(--radius-md)' }}
          >
            NeoVocab を無料で使ってみる
            <ArrowRight size={16} />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--lc-border)', marginTop: '4rem' }}>
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
