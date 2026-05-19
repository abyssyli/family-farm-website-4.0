import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import type { CatalogProduct } from "@/lib/catalog-schema"

export function ProductCard({
  product,
  href
}: {
  product: CatalogProduct
  href: string
}) {
  return (
    <Card className="overflow-hidden">
      {product.imagePath ? (
        <div className="relative h-48 w-full">
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold">{product.name}</h3>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-900">
            {product.priceHint}
          </p>
          {product.stockQuantity !== null && product.stockQuantity !== undefined && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                product.stockQuantity > 0 [modified]
                  ? "text-farm-700"
                  : "text-red-600"
              }`}
            >
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : "Out of stock"}
            </span>
          )}
        </div>
        <div className="mt-5">
          <Link
            href={href}
            className="text-sm font-medium text-farm-800 hover:text-farm-900"
          >
            View details →
          </Link>
        </div>
      </div>
    </Card>
  )
}
