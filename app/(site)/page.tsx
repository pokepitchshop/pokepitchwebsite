import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Package, Star, Users } from "lucide-react"
import { CardTile } from "@/components/catalog/card-tile"
import { ContactForm } from "@/components/contact-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getFeaturedCards } from "@/lib/inventory"
import { HomeStructuredData } from "@/components/home-structured-data"

const EBAY_STORE_URL = "https://www.ebay.com/str/tnt4sportscards"

export default function HomePage() {
  const featuredCards = getFeaturedCards(6)

  return (
    <>
      <HomeStructuredData />
      {/* Hero */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <Badge className="mb-4 border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
            Trading Card Experts
          </Badge>
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Your Trusted Source for
            <span className="block text-yellow-400">Trading Cards</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-300">
            Welcome to PokePitchShop! We&apos;re passionate trading card experts
            dedicated to bringing you the finest Pokemon and sports cards. From
            rare finds to everyday favorites, we&apos;ve got your collection covered.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600"
              asChild
            >
              <Link href="/catalog">Browse Catalog</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 bg-transparent text-white hover:bg-slate-700"
              asChild
            >
              <a
                href={EBAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Visit Our eBay Store
              </a>
            </Button>
          </div>
        </div>
      </section>

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
            <Card className="border-slate-700 bg-slate-800">
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
                  Rare holographics, vintage cards, modern sets, and everything
                  in between. We specialize in authentic Pokemon cards from all
                  generations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800">
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

            <Card className="border-slate-700 bg-slate-800">
              <CardHeader className="text-center">
                <Image
                  src="/images/gradedcards.png"
                  alt="Graded Cards"
                  width={200}
                  height={200}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
                <CardTitle className="text-white">Graded Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">
                  PSA, BGS, and other professionally graded cards. Perfect for
                  serious collectors looking for authenticated, high-grade
                  specimens.
                </CardDescription>
              </CardContent>
            </Card>
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCards.map((card) => (
              <CardTile key={card.id} card={card} />
            ))}
          </div>

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
