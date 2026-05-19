import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"
import { getPublicEnv } from "@/lib/env"
import type { Database } from "@/lib/supabase/types"

type Address = Database["public"]["Tables"]["user_addresses"]["Row"]

export function BuyContactModal({
  open,
  onClose,
  title,
  categorySlug,
  productId,
  defaultMessage
}: {
  open: boolean
  onClose: () => void
  title: string
  categorySlug: string
  productId: string | null
  defaultMessage: string
}) {
  const { supabase, session } = useSupabaseAuth()
  const { contactPhone } = getPublicEnv()
  const [message, setMessage] = useState(defaultMessage)
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  useEffect(() => {
    if (supabase && session && open) {
      supabase
        .from("user_addresses")
        .select("*")
        .order("is_default", { ascending: false })
        .then(({ data }) => {
          if (data) {
            setAddresses(data)
            const defaultAddr = data.find((a) => a.is_default)
            if (defaultAddr) setSelectedAddressId(defaultAddr.id)
            else if (data.length > 0) setSelectedAddressId(data[0].id)
          }
        })
    }
  }, [supabase, session, open])

  const smsHref = useMemo(() => {
    const body = encodeURIComponent(message)
    const digits = contactPhone.replace(/[^\d+]/g, "")
    return `sms:${digits}?&body=${body}`
  }, [contactPhone, message])

  async function saveInquiry() {
    if (!supabase) return
    if (session && !selectedAddressId) {
      alert("Please select or add an address first.")
      return
    }

    setStatus("saving")
    await supabase.from("inquiries").insert({
      user_id: session?.user.id ?? null,
      product_id: productId,
      category_slug: categorySlug,
      address_id: selectedAddressId, [modified]
      message
    })
    setStatus("saved")
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-700">
          We keep it simple. Call or text Paula to check availability and set up
          pickup.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium">Phone</p>
            <p className="mt-1 font-mono text-sm">{contactPhone}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium">Payment Methods</p>
            <p className="mt-1 text-sm">Zelle (to phone) or Check</p>
            <p className="text-[10px] text-zinc-600 mt-1 italic">Send Zelle to {contactPhone}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">No credit cards</p>
          </div>
        </div>

        {session && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Delivery Address</label>
              <Link
                href="/account"
                className="text-xs text-farm-700 hover:underline"
              >
                Manage addresses
              </Link>
            </div>
            {addresses.length > 0 ? (
              <select
                value={selectedAddressId || ""}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
              >
                <option value="" disabled>
                  Select an address
                </option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} - {a.address_line1}, {a.city}
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-300 p-3 text-center">
                <p className="text-xs text-zinc-500">No addresses found.</p>
                <Link
                  href="/account"
                  className="mt-1 inline-block text-xs font-medium text-farm-700 hover:underline"
                >
                  Add your first address →
                </Link>
              </div>
            )}
          </div>
        )}

        {!session && (
          <p className="text-xs text-zinc-500 italic">
            Sign in to add a delivery address to your inquiry.
          </p>
        )}

        <label className="text-sm font-medium">
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => window.open(smsHref)}>
            Open text message
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={async () => {
              await saveInquiry()
            }}
            disabled={
              status === "saving" ||
              !supabase ||
              (!!session && !selectedAddressId)
            }
            title={
              supabase
                ? "Save inquiry"
                : "Configure Supabase to save inquiries"
            }
          >
            {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}