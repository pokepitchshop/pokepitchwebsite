"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ExternalLink, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const EBAY_STORE_URL = "https://www.ebay.com/str/tnt4sportscards"

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/catalog", label: "Catalog" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/pokepitchshoplogo.png"
            alt="PokePitchShop Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <span className="text-xl font-bold text-white sm:text-2xl">
            PokePitchShop
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Button
            size="sm"
            className="ml-2 bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600"
            asChild
          >
            <a
              href={EBAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              eBay Store
            </a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-slate-700 bg-slate-900 text-white"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-lg font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="mt-4 bg-yellow-500 font-semibold text-slate-900 hover:bg-yellow-600"
                asChild
              >
                <a
                  href={EBAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  eBay Store
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
