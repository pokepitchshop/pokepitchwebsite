import Link from "next/link"
import { HeroCardCarousel } from "@/components/home/hero-card-carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Card } from "@/lib/types/card"
import { cn } from "@/lib/utils"

type HomeHeroProps = {
  featuredCards: Card[]
}

const CATEGORY_SHORTCUTS = [
  { label: "Pokemon", href: "/catalog/pokemon" },
  { label: "Sports", href: "/catalog/sports" },
  { label: "MTG", href: "/catalog/mtg" },
]

export function HomeHero({ featuredCards }: HomeHeroProps) {
  const hasCards = featuredCards.length > 0

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div
        className={cn(
          "mx-auto grid max-w-7xl items-center gap-12",
          hasCards ? "lg:grid-cols-2" : "max-w-3xl"
        )}
      >
        <div className={cn(hasCards ? "text-center lg:text-left" : "text-center")}>
          <Badge className="mb-4 border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
            Trading Card Experts
          </Badge>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Your Trusted Source for
            <span className="block text-yellow-400">Trading Cards</span>
          </h1>
          <p
            className={cn(
              "mb-8 text-xl text-slate-300",
              hasCards ? "mx-auto max-w-xl lg:mx-0" : "mx-auto max-w-3xl"
            )}
          >
            Authentic Pokemon, sports, and Magic: The Gathering cards from a
            collector-owned shop. Browse our live inventory and find your next
            grail.
          </p>
          <div
            className={cn(
              "flex flex-col gap-4 sm:flex-row sm:items-center",
              hasCards ? "justify-center lg:justify-start" : "justify-center"
            )}
          >
            <Button
              size="lg"
              className="bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600"
              asChild
            >
              <Link href="/catalog">Browse Catalog</Link>
            </Button>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {CATEGORY_SHORTCUTS.map((category) => (
                <Button
                  key={category.href}
                  size="lg"
                  variant="outline"
                  className="border-slate-600 bg-transparent text-white hover:bg-slate-700 hover:text-white"
                  asChild
                >
                  <Link href={category.href}>{category.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {hasCards && <HeroCardCarousel cards={featuredCards} />}
      </div>
    </section>
  )
}
