import type { Metadata } from "next"
import { Suspense } from "react"
import { Package } from "lucide-react"
import { CardTile } from "@/components/catalog/card-tile"
import { CatalogFilters } from "@/components/catalog/catalog-filters"
import { CatalogPagination } from "@/components/catalog/catalog-pagination"
import { getCatalogPage } from "@/lib/ebay/catalog"
import type { CardCategory, CardStatus, GradedFilter } from "@/lib/types/card"

export const metadata: Metadata = {
  title: "Card Catalog | PokePitchShop",
  description:
    "Browse live inventory synced from our eBay store. Filter by category and search listings.",
  alternates: {
    canonical: "/catalog",
  },
}

export const revalidate = 3600

type CatalogPageProps = {
  searchParams: Promise<{
    category?: string
    status?: string
    graded?: string
    q?: string
    page?: string
  }>
}

function parseCategory(value?: string): CardCategory | "all" {
  if (value === "pokemon" || value === "sports" || value === "mtg") return value
  return "all"
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

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const page = parsePage(params.page)

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
      category: parseCategory(params.category),
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

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Card Catalog
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">
            Live inventory from our eBay store — updated hourly. Filter, search,
            and buy on eBay with buyer protection.
          </p>
        </div>

        <Suspense fallback={null}>
          <CatalogFilters />
        </Suspense>

        {loadError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center">
            <p className="text-red-300">{loadError}</p>
            <p className="mt-2 text-sm text-slate-400">
              Check your eBay credentials in `.env` and try again.
            </p>
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
