import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"

export type BlogPostCategory = "pokemon" | "sports" | "mtg" | "general"

export type BlogPost = {
  slug: string
  title: string
  description: string
  publishedAt: string
  category: BlogPostCategory
  tags: string[]
  featuredImage?: string
  content: string
}

const BLOG_DIR = join(process.cwd(), "content", "blog")

function parsePostFile(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx?$/, "")
  const raw = readFileSync(join(BLOG_DIR, filename), "utf8")
  const { data, content } = matter(raw)

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishedAt: String(data.publishedAt ?? new Date().toISOString().slice(0, 10)),
    category: (data.category as BlogPostCategory) ?? "general",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featuredImage: data.featuredImage ? String(data.featuredImage) : undefined,
    content,
  }
}

export function getAllBlogPosts(): BlogPost[] {
  if (!existsSync(BLOG_DIR)) return []

  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map(parsePostFile)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug)
}

export function getRelatedCatalogLink(category: BlogPostCategory): {
  href: string
  label: string
} {
  switch (category) {
    case "pokemon":
      return { href: "/catalog/pokemon", label: "Shop Pokemon cards" }
    case "sports":
      return { href: "/catalog/sports", label: "Shop sports cards" }
    case "mtg":
      return { href: "/catalog/mtg", label: "Shop MTG cards" }
    default:
      return { href: "/catalog", label: "Browse our catalog" }
  }
}
