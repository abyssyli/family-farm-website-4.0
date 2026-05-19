import { createServiceRoleSupabaseClient } from "@/lib/supabase/server"
import { loadCatalogFromSource } from "./parse-catalog"

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function runOnce() {
  const supabase = createServiceRoleSupabaseClient()
  if (!supabase) {
    throw new Error(
      "Missing Supabase config. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    )
  }

  const { catalog, sourceLabel } = await loadCatalogFromSource()

  const categories = catalog.categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    sort_order: c.sortOrder
  }))

  const products = catalog.products.map((p) => ({
    id: p.id,
    category_slug: p.categorySlug,
    slug: p.slug,
    name: p.name,
    description: p.description,
    image_path: p.imagePath,
    price_hint: p.priceHint,
    external_url: p.externalUrl,
    is_active: p.isActive,
    stock_quantity: p.stockQuantity,
    updated_at: new Date().toISOString()
  }))

  const journalPosts = catalog.journalPosts.map((j) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    excerpt: j.excerpt,
    body: j.body,
    published_at: j.publishedAt,
    updated_at: new Date().toISOString()
  }))

  const farmRegions = catalog.farmRegions.map((r) => ({ [modified]
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    image_path: r.imagePath,
    cta_label: r.ctaLabel,
    cta_href: r.ctaHref,
    x: r.x,
    y: r.y
  }))

  const startedAt = Date.now()
  try {
    const upserts = await Promise.all([
      supabase.from("categories").upsert(categories, { onConflict: "slug" }),
      supabase.from("products").upsert(products, { onConflict: "id" }),
      supabase.from("journal_posts").upsert(journalPosts, { onConflict: "id" }),
      supabase.from("farm_regions").upsert(farmRegions, { onConflict: "id" })
    ])

    for (const res of upserts) {
      if (res.error) {
        console.error("Upsert error details:", JSON.stringify(res.error, null, 2))
        throw res.error
      }
    }

    const ms = Date.now() - startedAt
    await supabase.from("sync_runs").insert({
      status: "success",
      source: sourceLabel,
      message: `Upserted ${products.length} products in ${ms}ms`
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    await supabase.from("sync_runs").insert({
      status: "error",
      source: sourceLabel,
      message
    })
    throw e
  }
}

async function main() {
  const once = process.env.SYNC_ONCE?.trim() === "1"
  const intervalMs = Number(process.env.SYNC_INTERVAL_MS || "300000")

  if (once) {
    await runOnce()
    return
  }

  for (;;) {
    try {
      await runOnce()
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      console.error(message)
    }
    await sleep(intervalMs)
  }
}

main().catch((e) => {
  const message = e instanceof Error ? e.message : String(e)
  console.error(message)
  process.exit(1)
})
