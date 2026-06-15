"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type CatalogPaginationProps = {
  page: number
  totalPages: number
  total: number
}

export function CatalogPagination({
  page,
  totalPages,
  total,
}: CatalogPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function pageHref(targetPage: number): string {
    const params = new URLSearchParams(searchParams.toString())
    if (targetPage <= 1) {
      params.delete("page")
    } else {
      params.set("page", String(targetPage))
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-slate-400">
        Page {page} of {totalPages} · {total.toLocaleString()} listings
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-slate-600 bg-transparent text-white hover:bg-slate-700"
          disabled={page <= 1}
          asChild={page > 1}
        >
          {page > 1 ? (
            <Link href={pageHref(page - 1)}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          className="border-slate-600 bg-transparent text-white hover:bg-slate-700"
          disabled={page >= totalPages}
          asChild={page < totalPages}
        >
          {page < totalPages ? (
            <Link href={pageHref(page + 1)}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <span>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
