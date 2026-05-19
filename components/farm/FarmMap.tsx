
/* daily modify record */
"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { FarmRegionCard } from "./FarmRegionCard"
import type { CatalogFarmRegion } from "@/lib/catalog-schema"

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function FarmMap({ regions }: { regions: CatalogFarmRegion[] }) {
  const sorted = useMemo(
    () => [...regions].sort((a, b) => a.title.localeCompare(b.title)),
    [regions]
  )
  const [activeSlug, setActiveSlug] = useState(sorted[0]?.slug ?? null)
  const active = useMemo(
    () => sorted.find((r) => r.slug === activeSlug) ?? sorted[0] ?? null,
    [activeSlug, sorted]
  )
  const coverImagePath = useMemo(() => {
    if (!active) return "/photos/Home.jpg"
    if (active.slug === "chicken-coop") return "/photos/chicken2.jpg"
    if (active.slug === "woodshop") return "/photos/Wooden2.jpg"
    return active.imagePath || "/photos/Home.jpg"
  }, [active])

  if (sorted.length === 0) return null

  return (
    <section className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-start">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Explore the farm
        </h2>
        <p className="mt-2 text-sm text-zinc-700">
          Tap a region to learn what we’re making this season.
        </p>

        <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative">
            <Image
              src={coverImagePath}
              alt="Farm map"
              width={1400}
              height={900}
              className="h-[360px] w-full object-cover sm:h-[440px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {sorted.map((r) => {
              const isActive = r.slug === activeSlug
              return (
                <button
                  key={r.id}
                  type="button"
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm ring-1 transition",
                    isActive
                      ? "bg-farm-700 text-white ring-farm-800"
                      : "bg-white text-zinc-900 ring-zinc-200 hover:bg-zinc-50"
                  )}
                  style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  onClick={() => setActiveSlug(r.slug)}
                >
                  {r.title}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="lg:mt-12">
        {active ? <FarmRegionCard region={active} /> : null}
        <div className="mt-6 grid gap-4">
          {sorted
            .filter((r) => r.slug !== activeSlug)
            .slice(0, 2)
            .map((r) => (
              <button
                key={r.id}
                type="button"
                className="text-left"
                onClick={() => setActiveSlug(r.slug)}
              >
                <FarmRegionCard region={r} />
              </button>
            ))}
        </div>
      </div>
    </section>
  )
}
