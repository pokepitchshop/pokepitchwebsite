import Image from "next/image"
import Link from "next/link"
import { Package, Star, Users } from "lucide-react"
import { CardTile } from "@/components/catalog/card-tile"
import { ContactForm } from "@/components/contact-form"
import { HomeHero } from "@/components/home/home-hero"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getFeaturedEbayCards } from "@/lib/ebay/catalog"
import { HomeStructuredData } from "@/components/home-structured-data"

export default async function HomePage() {
  let featuredCards: Awaited<ReturnType<typeof getFeaturedEbayCards>> = []

  try {
    featuredCards = await getFeaturedEbayCards(12)
  } catch {
    featuredCards = []
  }

  return (
    <>
      <HomeStructuredData />
      {/* Hero */}
      <HomeHero featuredCards={featuredCards} />

      {/* About */}
      <section id="about" className="bg-slate-800/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Our Story
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-300">
              What started as a shared passion for collecting has grown into a
              trusted business serving collectors worldwide.
            </p>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Image
                src="/images/ourstory.png"
                alt="Father and son examining trading cards"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Users className="mt-1 h-8 w-8 flex-shrink-0 text-yellow-400" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Collector-Owned Business
                  </h3>
                  <p className="text-slate-300">
                    Our passion for trading cards drives everything we do. Every
                    card we sell is personally inspected and carefully packaged by
                    collectors who understand the value of your investment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Package className="mt-1 h-8 w-8 flex-shrink-0 text-yellow-400" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Quality Guaranteed
                  </h3>
                  <p className="text-slate-300">
                    We understand the value of your collection. That&apos;s why we
                    take extra care in grading, packaging, and shipping every
                    single card to ensure it arrives in perfect condition.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Star className="mt-1 h-8 w-8 flex-shrink-0 text-yellow-400" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Trusted by Collectors
                  </h3>
                  <p className="text-slate-300">
                    With hundreds of satisfied customers on eBay and beyond,
                    we&apos;ve built our reputation on honesty, fair pricing, and
                    exceptional customer service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              What We Offer
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-300">
              From individual cards to complete sets, we specialize in both
              Pokemon and sports trading cards.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/catalog/pokemon" className="block">
              <Card className="h-full border-slate-700 bg-slate-800 transition-colors hover:border-yellow-500/50">
                <CardHeader className="text-center">
                  <Image
                    src="/images/Pokemon.png"
                    alt="Pokemon Cards"
                    width={200}
                    height={200}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                  <CardTitle className="text-white">Pokemon Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    Rare hologographics, vintage cards, modern sets, and everything
                    in between. We specialize in authentic Pokemon cards from all
                    generations.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog/sports" className="block">
              <Card className="h-full border-slate-700 bg-slate-800 transition-colors hover:border-yellow-500/50">
                <CardHeader className="text-center">
                  <Image
                    src="/images/sportscards.png"
                    alt="Sports Cards"
                    width={200}
                    height={200}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                  <CardTitle className="text-white">Sports Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    Baseball, football, basketball, and more. From rookie cards to
                    hall of famers, we carry a wide selection of sports trading
                    cards.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/catalog/mtg" className="block">
              <Card className="h-full border-slate-700 bg-slate-800 transition-colors hover:border-yellow-500/50">
                <CardHeader className="text-center">
                  <Image
                    src="/images/gradedcards.png"
                    alt="Magic: The Gathering Cards"
                    width={200}
                    height={200}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                  <CardTitle className="text-white">MTG Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    Magic: The Gathering singles and bulk lots from classic sets.
                    NM condition cards for players and collectors alike.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured from inventory */}
      <section id="featured" className="bg-slate-800/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Featured Items
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-300">
              A selection from our current inventory. Browse the full catalog for
              more.
            </p>
          </div>

          {featuredCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCards.slice(0, 6).map((card) => (
                <CardTile key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400">
              Featured listings load from eBay when credentials are configured.
            </p>
          )}

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600"
              asChild
            >
              <Link href="/catalog">View Full Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Get In Touch
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-300">
              Have questions about a specific card? Looking for something
              special? Drop us a line!
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
