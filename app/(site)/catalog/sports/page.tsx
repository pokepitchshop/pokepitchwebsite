import {
  CategoryCatalogPage,
  buildCategoryPageMetadata,
} from "@/components/catalog/category-catalog-page"

export const revalidate = 3600

type PageProps = {
  searchParams: Promise<{
    status?: string
    graded?: string
    q?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: PageProps) {
  return buildCategoryPageMetadata("sports", searchParams)
}

export default function SportsCatalogPage({ searchParams }: PageProps) {
  return <CategoryCatalogPage category="sports" searchParams={searchParams} />
}
