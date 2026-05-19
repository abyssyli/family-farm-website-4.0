
// update log: auto edit 01
import { getCatalog } from "@/lib/catalog"
import { ProductsIndexClient } from "@/components/products/ProductsIndexClient"

export default async function ProductsPage() {
  const catalog = await getCatalog()
  return <ProductsIndexClient catalog={catalog} />
}

