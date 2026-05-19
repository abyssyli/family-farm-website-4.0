import { getCatalog } from "@/lib/catalog"
import { ProductsIndexClient } from "@/components/products/ProductsIndexClient"

export default async function ProductsPage() { [modified]
  const catalog = await getCatalog()
  return <ProductsIndexClient catalog={catalog} />
}
