import Image from "next/image"
import { ExternalLink, Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

const EBAY_STORE_URL = "https://www.ebay.com/str/tnt4sportscards"
const WHATNOT_URL = "https://www.whatnot.com/user/pokepitchshop"
const TWITTER_URL = "https://x.com/pokepitchshop"
const EMAIL = "tom@pokepitchshop.com"

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mb-4 flex items-center justify-center">
          <Image
            src="/images/pokepitchshoplogo.png"
            alt="PokePitchShop Logo"
            width={32}
            height={32}
            className="mr-3"
          />
          <span className="text-2xl font-bold text-white">PokePitchShop</span>
        </div>
        <p className="mb-6 text-slate-300">
          Your trusted source for authentic Pokemon and sports trading cards.
        </p>
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
            asChild
          >
            <a href={EBAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              eBay Store
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
            asChild
          >
            <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter/X
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
            asChild
          >
            <a href={WHATNOT_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Whatnot
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
            asChild
          >
            <a href={`mailto:${EMAIL}`}>
              <Mail className="mr-2 h-4 w-4" />
              Email Us
            </a>
          </Button>
        </div>
        <div className="border-t border-slate-700 pt-8">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} PokePitchShop. All rights reserved. |
            Authentic trading cards, honest service, collector values.
          </p>
        </div>
      </div>
    </footer>
  )
}
