import type { Metadata } from "next"
import { Suspense } from "react"
import { Package } from "lucide-react"
import Script from "next/script"
import { CardTile } from "@/components/catalog/card-tile"
import { CatalogFilters } from "@/components/catalog/catalog-filters"
import { CatalogPagination } from "@/components/catalog/catalog-pagination"
import { getCatalogPage } from "@/lib/ebay/catalog"
import { CATEGORY_SEO_COPY } from "@/lib/seo/category-copy"
import { buildItemListSchema } from "@/lib/seo/product-schema"
import { SITE_URL } from "@/lib/seo/constants"
import type { CardCategory, CardStatus, GradedFilter } from "@/lib/types/card"

export const revalidate = 3600

type CategoryCatalogPageProps = {
  category: CardCategory
  searchParams: Promise<{
    status?: string
    graded?: string
    q?: string
    page?: string
  }>
}

function parseStatus(value?: string): CardStatus | "all" {
  if (value === "available" || value === "sold") return value
  return "all"
}

function parseGraded(value?: string): GradedFilter {
  if (value === "graded" || value === "raw") return value
  return "all"
}

function parsePage(value?: string): number {
  const page = Number(value ?? "1")
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export function buildCategoryMetadata(category: CardCategory): Metadata {
  const copy = CATEGORY_SEO_COPY[category]
  const canonical = `/catalog/${category}`

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE_URL}${canonical}`,
    },
    robots: { index: true, follow: true },
  }
}

export async function buildCategoryPageMetadata(
  category: CardCategory,
  searchParams: CategoryCatalogPageProps["searchParams"]
): Promise<Metadata> {
  const params = await searchParams
  const page = parsePage(params.page)
  const base = buildCategoryMetadata(category)

  if (page > 1) {
    return {
      ...base,
      robots: { index: false, follow: true },
      alternates: { canonical: `/catalog/${category}` },
    }
  }

  return base
}

export async function CategoryCatalogPage({
  category,
  searchParams,
}: CategoryCatalogPageProps) {
  const params = await searchParams
  const page = parsePage(params.page)
  const copy = CATEGORY_SEO_COPY[category]

  let catalog = {
    cards: [] as Awaited<ReturnType<typeof getCatalogPage>>["cards"],
    total: 0,
    totalPages: 1,
    page: 1,
    pageSize: 24,
  }
  let loadError: string | null = null

  try {
    catalog = await getCatalogPage({
      category,
      status: parseStatus(params.status),
      graded: parseGraded(params.graded),
      query: params.q ?? "",
      page,
      pageSize: 24,
    })
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load eBay inventory right now."
  }

  const listUrl = `${SITE_URL}/catalog/${category}`
  const itemListSchema =
    page === 1 && catalog.cards.length > 0
      ? buildItemListSchema(catalog.cards, copy.h1, listUrl)
      : null

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      {itemListSchema && (
        <Script
          id={`itemlist-schema-${category}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {copy.h1}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-300">
            {copy.intro}
          </p>
        </div>

        <Suspense fallback={null}>
          <CatalogFilters fixedCategory={category} />
        </Suspense>

        {loadError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="text-red-300">{loadError}</p>
          </div>
        ) : catalog.cards.length === 0 ? (
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <h2 className="mb-2 text-xl font-semibold text-white">
              No cards match your filters
            </h2>
            <p className="text-slate-400">
              Try adjusting your search or filter settings to see more results.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-400">
              Showing {catalog.cards.length} of{" "}
              {catalog.total.toLocaleString()} listings
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.cards.map((card) => (
                <CardTile key={card.id} card={card} />
              ))}
            </div>
            <Suspense fallback={null}>
              <CatalogPagination
                page={catalog.page}
                totalPages={catalog.totalPages}
                total={catalog.total}
              />
            </Suspense>
          </>
        )}
      </div>
    </section>
  )
}
