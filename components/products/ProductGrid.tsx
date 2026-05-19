import type { CatalogProduct } from "@/lib/catalog-schema"
import { ProductCard } from "./ProductCard"

export function ProductGrid({
  products,
  categorySlug
}: {
  products: CatalogProduct[]
  categorySlug: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          href={`/products/${categorySlug}/${p.slug}`}
        />
      ))}
    </div>
  )
}


/* minor adjust */
