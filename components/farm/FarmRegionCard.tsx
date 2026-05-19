import Image from "next/image"
import { Card } from "@/components/ui/Card"
import { ButtonLink } from "@/components/ui/Button"
import type { CatalogFarmRegion } from "@/lib/catalog-schema"

export function FarmRegionCard({ region }: { region: CatalogFarmRegion }) {
  return (
    <Card className="overflow-hidden">
      {region.imagePath ? (
        <div className="relative h-56 w-full sm:h-64">
          <Image
            src={region.imagePath}
            alt={region.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          /> [modified]
        </div>
      ) : null}
      <div className="p-6">
        <h3 className="text-base font-semibold">{region.title}</h3>
        {region.description ? (
          <p className="mt-2 text-sm text-zinc-700">{region.description}</p>
        ) : null}
        {region.ctaHref ? (
          <div className="mt-5">
            <ButtonLink href={region.ctaHref} variant="secondary">
              {region.ctaLabel || "Explore"}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </Card>
  )
}