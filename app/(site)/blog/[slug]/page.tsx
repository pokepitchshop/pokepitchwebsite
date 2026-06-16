import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Script from "next/script"
import { BlogMarkdown } from "@/components/blog/blog-markdown"
import { Button } from "@/components/ui/button"
import {
  getBlogPostBySlug,
  getAllBlogPosts,
  getRelatedCatalogLink,
} from "@/lib/blog/posts"
import { buildBlogPostingSchema } from "@/lib/seo/product-schema"
import { SITE_URL } from "@/lib/seo/constants"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return { title: "Post Not Found | PokePitchShop" }
  }

  return {
    title: `${post.title} | PokePitchShop Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: post.featuredImage
        ? [{ url: post.featuredImage }]
        : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedLink = getRelatedCatalogLink(post.category)
  const schema = buildBlogPostingSchema(post)

  return (
    <article className="px-4 py-12 sm:px-6 lg:px-8">
      <Script
        id={`blog-schema-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm text-slate-500">
          <Link href="/blog" className="text-slate-400 hover:text-white">
            Blog
          </Link>
          {" · "}
          {post.publishedAt}
        </p>
        <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl">
          {post.title}
        </h1>
        <p className="mb-10 text-lg text-slate-300">{post.description}</p>

        <BlogMarkdown content={post.content} />

        <div className="mt-12 rounded-lg border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-white">
            Shop our inventory
          </h2>
          <p className="mb-4 text-slate-300">
            Ready to add to your collection? Browse live listings from our eBay store.
          </p>
          <Button
            className="bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600"
            asChild
          >
            <Link href={relatedLink.href}>{relatedLink.label}</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
