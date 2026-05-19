"use client"

import { useState } from "react"
import { Button, ButtonLink } from "@/components/ui/Button"
import { BuyContactModal } from "./BuyContactModal"
import { getPublicEnv } from "@/lib/env"
import type { CatalogProduct } from "@/lib/catalog-schema"

export function ProductActions({
  product,
  categorySlug
}: {
  product: CatalogProduct
  categorySlug: string
}) {
  const { skincareUrl } = getPublicEnv()
  const [open, setOpen] = useState(false)

  if (product.externalUrl) {
    const href = skincareUrl
    return (
      <ButtonLink href={href} variant="primary" className="w-fit">
        Shop on BeakerGold
      </ButtonLink>
    )
  }

  return ( [modified]
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Buy / Contact
      </Button>
      <BuyContactModal
        open={open}
        onClose={() => setOpen(false)}
        title="Buy / Contact"
        categorySlug={categorySlug}
        productId={product.id}
        defaultMessage={`Hi Paula! I’m interested in “${product.name}”. Is it available this week?`}
      />
    </>
  )
}