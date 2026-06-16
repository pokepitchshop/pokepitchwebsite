import type { Metadata } from "next"
import Link from "next/link"
import { getAllBlogPosts } from "@/lib/blog/posts"
import { SITE_URL } from "@/lib/seo/constants"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Trading Card Blog | Guides & Tips | PokePitchShop",
  description:
    "Buying guides, authentication tips, and collector advice from PokePitchShop. Learn before you buy.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Trading Card Blog | PokePitchShop",
    description:
      "Buying guides, authentication tips, and collector advice from PokePitchShop.",
    url: `${SITE_URL}/blog`,
  },
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Trading Card Blog
          </h1>
          <p className="text-lg text-slate-300">
            Guides, grading tips, and collector advice from the PokePitchShop team.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="border-slate-700 bg-slate-800 transition-colors hover:border-yellow-500/50">
                <CardHeader>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge className="capitalize">{post.category}</Badge>
                    <span className="text-sm text-slate-500">{post.publishedAt}</span>
                  </div>
                  <CardTitle className="text-white">{post.title}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-400">Read article →</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
