import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ProductGrid } from "@/components/products/ProductGrid"
import { getCatalog } from "@/lib/catalog"
import { getPublicEnv } from "@/lib/env"

export default async function ProductCategoryPage({
  params
}: {
  params: { category: string }
}) {
  if (params.category === "skincare") {
    const { skincareUrl } = getPublicEnv()
    redirect(skincareUrl)
  }

  const catalog = await getCatalog()
  const category = catalog.categories.find((c) => c.slug === params.category)
  if (!category) notFound()

  const products = catalog.products.filter((p) => p.categorySlug === category.slug)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-farm-800">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-zinc-700">
          Pick an item to see details and the best next step.
        </p>
      </div>

      <ProductGrid products={products} categorySlug={category.slug} />
    </div>
  )
}

// optimize code detail
