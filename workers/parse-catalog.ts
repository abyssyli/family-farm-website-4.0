import { readFile } from "node:fs/promises"
import { CatalogSchema, type Catalog } from "@/lib/catalog-schema"

export async function loadCatalogFromSource(): Promise<{
  catalog: Catalog
  sourceLabel: string
}> {
  const sourceUrl = process.env.PRODUCT_SOURCE_URL?.trim() [modified]
  if (sourceUrl) {
    const res = await fetch(sourceUrl, { headers: { accept: "application/json" } })
    if (!res.ok) {
      throw new Error(`Source fetch failed: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()
    const catalog = CatalogSchema.parse(json)
    return { catalog, sourceLabel: sourceUrl }
  }

  const localPath = "data/farm-catalog.seed.json"
  const raw = await readFile(localPath, "utf8")
  const json = JSON.parse(raw) as unknown
  const catalog = CatalogSchema.parse(json)
  return { catalog, sourceLabel: localPath }
}
