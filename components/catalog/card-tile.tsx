import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CardImage } from "@/components/catalog/card-image"
import {
  formatPrice,
  getConditionLabel,
  isCardGraded,
} from "@/lib/inventory"
import type { Card as InventoryCard } from "@/lib/types/card"
import { cn } from "@/lib/utils"

type CardTileProps = {
  card: InventoryCard
}

export function CardTile({ card }: CardTileProps) {
  const isSold = card.status === "sold"
  const isGraded = isCardGraded(card)

  return (
    <Link href={`/catalog/${card.id}`} className="group block">
      <Card
        className={cn(
          "overflow-hidden border-slate-700 bg-slate-800 transition-all duration-300 hover:border-yellow-500/50",
          isSold && "opacity-75"
        )}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <CardImage
            src={card.images[0]}
            alt={card.name}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
              <Badge className="bg-red-500/90 text-white">Sold</Badge>
            </div>
          )}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            <Badge
              className={
                isGraded
                  ? "border-purple-500/30 bg-purple-500/20 text-purple-300"
                  : "border-blue-500/30 bg-blue-500/20 text-blue-300"
              }
            >
              {getConditionLabel(card)}
            </Badge>
          </div>
          <div className="absolute right-2 top-2">
            <Badge className="border-slate-500/30 bg-slate-900/80 capitalize text-slate-200">
              {card.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-yellow-400">
            {card.name}
          </h3>
          <p className="mb-3 text-sm text-slate-400">
            {card.set} · #{card.number}
            {card.variant ? ` · ${card.variant}` : ""}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-green-400">
              {formatPrice(card.price, card.currency)}
            </span>
            {!isSold && (
              <Badge className="border-green-500/30 bg-green-500/20 text-green-400">
                Available
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
