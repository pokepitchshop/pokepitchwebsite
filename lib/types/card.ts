import { z } from "zod"

export const gradeSchema = z.object({
  company: z.string(),
  value: z.number(),
})

export const cardSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["pokemon", "sports", "mtg"]),
  set: z.string(),
  number: z.string(),
  variant: z.string().optional(),
  condition: z.string(),
  grade: gradeSchema.nullable(),
  price: z.number(),
  currency: z.literal("USD"),
  status: z.enum(["available", "sold"]),
  images: z.array(z.string()).min(1),
  description: z.string(),
  ebayUrl: z.string().url().optional(),
  ebayItemId: z.string().optional(),
  sku: z.string().optional(),
  dateAdded: z.string(),
})

export const inventorySchema = z.array(cardSchema)

export type CardGrade = z.infer<typeof gradeSchema>
export type Card = z.infer<typeof cardSchema>

export type CardCategory = Card["category"]
export type CardStatus = Card["status"]

export type GradedFilter = "all" | "graded" | "raw"

export type CardFilters = {
  category?: CardCategory | "all"
  status?: CardStatus | "all"
  graded?: GradedFilter
  query?: string
}
