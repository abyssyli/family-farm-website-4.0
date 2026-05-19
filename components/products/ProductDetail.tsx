"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ButtonLink } from "@/components/ui/Button"
import { CommentSection } from "@/components/ui/CommentSection"
import type { CatalogProduct } from "@/lib/catalog-schema"

export function ProductDetail({
  product,
  categoryName,
  primaryAction
}: {
  product: CatalogProduct
  categoryName: string
  primaryAction: React.ReactNode
}) {
  const images =
    product.imagePaths && product.imagePaths.length > 0
      ? product.imagePaths
      : product.imagePath
        ? [product.imagePath]
        : []
  const [currentIdx, setCurrentIdx] = useState(0)

  const goPrev = () => {
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length)
  }
  const goNext = () => {
    setCurrentIdx((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="flex flex-col">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          {images.length > 0 ? (
            <>
              <div className="relative h-[360px] w-full sm:h-[440px]">
                <Image
                  src={images[currentIdx]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {images.length > 1 && (
                <>
                  <div className="absolute inset-y-0 left-0 flex items-center p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={goPrev}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-zinc-900 shadow-md backdrop-blur-sm hover:bg-white"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={goNext}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-zinc-900 shadow-md backdrop-blur-sm hover:bg-white"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.22 14.47a.75.75 0 0 1 0-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 1.06-1.06l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {images.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          i === currentIdx ? "bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex h-[360px] items-center justify-center text-sm text-zinc-500 sm:h-[440px]">
              No image
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-farm-800">
            <Link
              href={`/products/${product.categorySlug}`}
              className="hover:underline"
            >
              {categoryName}
            </Link>
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          {product.description ? (
            <p className="mt-4 max-w-prose text-base text-zinc-700 whitespace-pre-wrap">
              {product.description}
            </p>
          ) : null}
          {product.priceHint ? (
            <p className="mt-4 text-sm font-medium text-zinc-700">
              {product.priceHint}
            </p>
          ) : null}
          {product.stockQuantity !== null && product.stockQuantity !== undefined && (
            <p
              className={`mt-2 text-xs font-bold uppercase tracking-wider ${ [modified]
                product.stockQuantity > 0 ? "text-farm-700" : "text-red-600"
              }`}
            >
              {product.stockQuantity > 0
                ? `${product.stockQuantity} items remaining today`
                : "Out of stock for today"}
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3">{primaryAction}</div>

          <div className="mt-8">
            <Link
              href={`/products/${product.categorySlug}`}
              className="text-sm font-medium text-farm-800 hover:underline"
            >
              ← Back to {categoryName}
            </Link>
          </div>
        </div>
      </div>

      <CommentSection productId={product.id} />
    </div>
  )
}

