import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neo-vocab.vercel.app'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/decks', '/study', '/quiz', '/settings', '/onboarding', '/contact'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
