"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterValues = {
  category: string
  graded: string
  status: string
  q: string
}

export function CatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [filters, setFilters] = useState<FilterValues>({
    category: searchParams.get("category") ?? "all",
    graded: searchParams.get("graded") ?? "all",
    status: searchParams.get("status") ?? "all",
    q: searchParams.get("q") ?? "",
  })

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") ?? "all",
      graded: searchParams.get("graded") ?? "all",
      status: searchParams.get("status") ?? "all",
      q: searchParams.get("q") ?? "",
    })
  }, [searchParams])

  const applyFilters = useCallback(
    (next: Partial<FilterValues>) => {
      const merged = { ...filters, ...next }
      setFilters(merged)

      const params = new URLSearchParams()
      if (merged.category !== "all") params.set("category", merged.category)
      if (merged.graded !== "all") params.set("graded", merged.graded)
      if (merged.status !== "all") params.set("status", merged.status)
      if (merged.q.trim()) params.set("q", merged.q.trim())

      const query = params.toString()
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname)
      })
    },
    [filters, pathname, router]
  )

  return (
    <div className="mb-8 rounded-lg border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-white">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="search"
              placeholder="Name, set, number..."
              value={filters.q}
              onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters({ q: filters.q })
              }}
              className="border-slate-600 bg-slate-700 pl-9 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => applyFilters({ category: value })}
          >
            <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="border-slate-600 bg-slate-800 text-white">
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="pokemon">Pokemon</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Type</Label>
          <Select
            value={filters.graded}
            onValueChange={(value) => applyFilters({ graded: value })}
          >
            <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="border-slate-600 bg-slate-800 text-white">
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="graded">Graded only</SelectItem>
              <SelectItem value="raw">Raw only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Availability</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => applyFilters({ status: value })}
          >
            <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
              <SelectValue placeholder="All items" />
            </SelectTrigger>
            <SelectContent className="border-slate-600 bg-slate-800 text-white">
              <SelectItem value="all">All items</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
