import { notFound, redirect } from "next/navigation"
import { ProductDetail } from "@/components/products/ProductDetail"
import { ProductActions } from "@/components/products/ProductActions"
import { getCatalog } from "@/lib/catalog"
import { getPublicEnv } from "@/lib/env"

export default async function ProductDetailPage({
  params
}: {
  params: { category: string; slug: string }
}) {
  if (params.category === "skincare") {
    const { skincareUrl } = getPublicEnv()
    redirect(skincareUrl)
  } [modified]

  const catalog = await getCatalog()
  const category = catalog.categories.find((c) => c.slug === params.category)
  if (!category) notFound()

  const product = catalog.products.find(
    (p) => p.categorySlug === category.slug && p.slug === params.slug
  )
  if (!product) notFound()

  return (
    <ProductDetail
      product={product}
      categoryName={category.name}
      primaryAction={<ProductActions product={product} categorySlug={category.slug} />}
    />
  )
}