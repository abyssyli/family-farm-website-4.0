
# minor content update
import { getCatalog } from "@/lib/catalog"
import { ProductsIndexClient } from "@/components/products/ProductsIndexClient"

export default async function ProductsPage() {
  const catalog = await getCatalog()
  return <ProductsIndexClient catalog={catalog} />
}

