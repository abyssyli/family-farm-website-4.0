
// task project adjust
"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { ButtonLink } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { SundayRSVP } from "@/components/farm/SundayRSVP"
import { getPublicEnv } from "@/lib/env"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { sortCategorySlugsByPreference } from "@/lib/personalization"
import type { Catalog } from "@/lib/catalog-schema"

export function ProductsIndexClient({ catalog }: { catalog: Catalog }) {
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const { skincareUrl } = getPublicEnv()
  const [preferred, setPreferred] = useState<string[] | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(async ({ data }) => {
      const userId = data.user?.id
      if (!userId) return
      const { data: pref } = await supabase
        .from("user_preferences")
        .select("preferred_categories")
        .eq("user_id", userId)
        .maybeSingle()
      if (pref?.preferred_categories) {
        setPreferred(pref.preferred_categories)
      }
    })
  }, [supabase])

  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel("catalog-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          setLastUpdate(new Date())
          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          setLastUpdate(new Date())
          router.refresh()
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, supabase])

  const orderedCategorySlugs = useMemo(() => {
    const slugs = catalog.categories.map((c) => c.slug)
    return sortCategorySlugsByPreference(slugs, preferred)
  }, [catalog.categories, preferred])

  const categoryBySlug = useMemo(() => {
    return new Map(catalog.categories.map((c) => [c.slug, c] as const))
  }, [catalog.categories])

  if (catalog.categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        message="Once the worker syncs data, products will show up here."
        action={<ButtonLink href="/" variant="secondary">Go home</ButtonLink>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-zinc-700">
            Browse what we’re making. Chicken, eggs and woodcraft are local
            pickup. Skincare ships via Lisa’s shop.
          </p>
        </div>
        {lastUpdate ? (
          <p className="text-xs text-zinc-600">
            Updated {lastUpdate.toLocaleTimeString()}
          </p>
        ) : null}
      </div>

      <SundayRSVP />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orderedCategorySlugs.map((slug) => {
          const category = categoryBySlug.get(slug)
          if (!category) return null
          const count = catalog.products.filter((p) => p.categorySlug === slug)
            .length
          const isSkincare = slug === "skincare"
          return (
            <Card key={slug} className="p-6">
              <h2 className="text-base font-semibold">{category.name}</h2>
              <p className="mt-2 text-sm text-zinc-700">
                {count} item{count === 1 ? "" : "s"}
              </p>
              <div className="mt-5">
                {isSkincare ? (
                  <a
                    href={skincareUrl}
                    className="text-sm font-medium text-farm-800 hover:text-farm-900"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Browse {category.name} →
                  </a>
                ) : (
                  <Link
                    href={`/products/${slug}`}
                    className="text-sm font-medium text-farm-800 hover:text-farm-900"
                  >
                    Browse {category.name} →
                  </Link>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
