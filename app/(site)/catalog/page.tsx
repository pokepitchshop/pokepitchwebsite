import type { Metadata } from "next"
import { Suspense } from "react"
import { Package } from "lucide-react"
import { CardTile } from "@/components/catalog/card-tile"
import { CatalogFilters } from "@/components/catalog/catalog-filters"
import { filterCards } from "@/lib/inventory"
import type { CardCategory, CardStatus, GradedFilter } from "@/lib/types/card"

export const metadata: Metadata = {
  title: "Card Catalog | PokePitchShop",
  description:
    "Browse authentic Pokemon and sports trading cards. Filter by category, condition, and availability.",
  alternates: {
    canonical: "/catalog",
  },
}

type CatalogPageProps = {
  searchParams: Promise<{
    category?: string
    status?: string
    graded?: string
    q?: string
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

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const cards = filterCards({
    category: parseCategory(params.category),
    status: parseStatus(params.status),
    graded: parseGraded(params.graded),
    query: params.q ?? "",
  })

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Card Catalog
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">
            Browse our current inventory synced from eBay. Filter by category,
            type, and availability.
          </p>
        </div>

        <Suspense fallback={null}>
          <CatalogFilters />
        </Suspense>

        {cards.length === 0 ? (
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
              Showing {cards.length} {cards.length === 1 ? "card" : "cards"}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <CardTile key={card.id} card={card} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
