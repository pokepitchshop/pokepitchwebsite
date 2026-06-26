"use client"

import { CardTile } from "@/components/catalog/card-tile"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { Card } from "@/lib/types/card"

type HeroCardCarouselProps = {
  cards: Card[]
}

const NAV_BUTTON_CLASSES =
  "border-slate-600 bg-slate-900/80 text-white hover:bg-slate-800 hover:text-white"

export function HeroCardCarousel({ cards }: HeroCardCarouselProps) {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full"
      aria-label="Featured cards from our inventory"
    >
      <CarouselContent>
        {cards.map((card) => (
          <CarouselItem
            key={card.id}
            className="basis-3/4 sm:basis-1/2 xl:basis-1/2"
          >
            <CardTile card={card} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={`left-2 ${NAV_BUTTON_CLASSES}`} />
      <CarouselNext className={`right-2 ${NAV_BUTTON_CLASSES}`} />
    </Carousel>
  )
}
