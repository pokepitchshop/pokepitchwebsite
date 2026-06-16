import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink } from "lucide-react"
import Script from "next/script"
import { CardImage } from "@/components/catalog/card-image"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { getEbayCardById } from "@/lib/ebay/catalog"
import {
  formatPrice,
  getConditionLabel,
  isCardGraded,
} from "@/lib/inventory"
import { getCategoryPath } from "@/lib/seo/category-copy"
import {
  buildBreadcrumbSchema,
  buildProductSchema,
} from "@/lib/seo/product-schema"

export const revalidate = 3600
export const dynamicParams = true

type CardDetailPageProps = {
  params: Promise<{ id: string }>
}

function getCategoryLabel(category: string): string {
  if (category === "mtg") return "Magic: The Gathering"
  return category.charAt(0).toUpperCase() + category.slice(1)
}

export async function generateMetadata({
  params,
}: CardDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const card = await getEbayCardById(id)

  if (!card) {
    return { title: "Card Not Found | PokePitchShop" }
  }

  return {
    title: `${card.name} | PokePitchShop`,
    description: card.description,
    alternates: {
      canonical: `/catalog/${card.id}`,
    },
    openGraph: {
      title: `${card.name} | PokePitchShop`,
      description: card.description,
      images: card.images[0] ? [{ url: card.images[0] }] : undefined,
    },
  }
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { id } = await params
  const card = await getEbayCardById(id)

  if (!card) {
    notFound()
  }

  const isSold = card.status === "sold"
  const isGraded = isCardGraded(card)
  const canBuy = !isSold && !!card.ebayUrl
  const categoryPath = getCategoryPath(card.category)
  const categoryLabel = getCategoryLabel(card.category)
  const structuredData = [
    buildProductSchema(card),
    buildBreadcrumbSchema(card),
  ]

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <Script
        id={`product-schema-${card.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-7xl">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/catalog"
                className="text-slate-400 hover:text-white"
              >
                Catalog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-600" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={categoryPath}
                className="text-slate-400 hover:text-white"
              >
                {categoryLabel}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-600" />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 text-white">
                {card.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
              <CardImage src={card.images[0]} alt={card.name} />
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                  <Badge className="bg-red-500/90 text-lg text-white">Sold</Badge>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className="border-slate-500/30 bg-slate-700 capitalize text-slate-200">
                {card.category}
              </Badge>
              <Badge
                className={
                  isGraded
                    ? "border-purple-500/30 bg-purple-500/20 text-purple-300"
                    : "border-blue-500/30 bg-blue-500/20 text-blue-300"
                }
              >
                {getConditionLabel(card)}
              </Badge>
              {isSold ? (
                <Badge className="border-red-500/30 bg-red-500/20 text-red-400">
                  Sold
                </Badge>
              ) : (
                <Badge className="border-green-500/30 bg-green-500/20 text-green-400">
                  Available
                </Badge>
              )}
            </div>

            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              {card.name}
            </h1>
            {card.sku && (
              <p className="mb-4 text-sm text-slate-500">SKU: {card.sku}</p>
            )}
            <p className="mb-6 text-lg text-slate-400">
              {card.set}
              {card.number ? ` · #${card.number}` : ""}
              {card.variant ? ` · ${card.variant}` : ""}
            </p>

            <p className="mb-8 text-3xl font-bold text-green-400">
              {formatPrice(card.price, card.currency)}
            </p>

            <p className="mb-8 leading-relaxed text-slate-300">
              {card.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {canBuy && (
                <Button
                  size="lg"
                  className="bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600"
                  asChild
                >
                  <a
                    href={card.ebayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Buy on eBay
                  </a>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 bg-transparent text-white hover:bg-slate-700"
                asChild
              >
                <Link href={categoryPath}>Browse {categoryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
