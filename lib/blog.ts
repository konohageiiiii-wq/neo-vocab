import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  image: string
  tags: string[]
  content: string
}

export function getAllPosts(): Omit<Post, 'content'>[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const filePath = path.join(BLOG_DIR, filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)

    return {
      slug,
      title: data.title as string,
      date: data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date),
      excerpt: data.excerpt as string,
      image: data.image as string,
      tags: (data.tags as string[]) ?? [],
    }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    date: data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date),
    excerpt: data.excerpt as string,
    image: data.image as string,
    tags: (data.tags as string[]) ?? [],
    content,
  }
}
