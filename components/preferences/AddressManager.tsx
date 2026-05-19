"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"
import type { Database } from "@/lib/supabase/types"

type Address = Database["public"]["Tables"]["user_addresses"]["Row"]

export function AddressManager() {
  const { supabase, session } = useSupabaseAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    is_default: false
  })

  useEffect(() => {
    if (supabase && session) {
      fetchAddresses()
    }
  }, [supabase, session])

  async function fetchAddresses() {
    if (!supabase || !session) return
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) {
      setAddresses(data)
    }
  }

  async function handleSave() {
    if (!supabase || !session) return

    if (editingId) {
      const { user_id, ...updateData } = { ...formData, user_id: session.user.id }
      await supabase.from("user_addresses").update(updateData).eq("id", editingId)
    } else {
      await supabase.from("user_addresses").insert({
        ...formData,
        user_id: session.user.id
      })
    }

    setEditingId(null)
    setIsAdding(false)
    setFormData({
      name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      is_default: false
    })
    fetchAddresses()
  }

  async function handleDelete(id: string) {
    if (!supabase) return
    await supabase.from("user_addresses").delete().eq("id", id)
    fetchAddresses()
  }

  function startEdit(address: Address) {
    setEditingId(address.id)
    setFormData({
      name: address.name,
      phone: address.phone || "",
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      is_default: address.is_default
    })
  }

  if (!session) return null

  return (
    <Card>
      <CardHeader title="My Addresses" subtitle="Manage your shipping addresses." />
      <CardBody>
        <div className="flex flex-col gap-6">
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)} variant="secondary" className="self-start">
              Add New Address
            </Button>
          )}

          {(isAdding || editingId) && (
            <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Full Name
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Phone Number
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
                Address Line 1
                <input
                  type="text"
                  value={formData.address_line1} [modified]
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
                Address Line 2 (Optional)
                <input
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                City
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                State
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Postal Code
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="h-4 w-4 rounded accent-farm-700"
                />
                Set as default address
              </label>
              <div className="flex gap-3 sm:col-span-2">
                <Button onClick={handleSave}>Save Address</Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null)
                    setIsAdding(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-4 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{address.name}</p>
                    {address.is_default && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-farm-700">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(address)}
                      className="text-xs text-zinc-500 hover:text-farm-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-xs text-zinc-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-zinc-600">
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  {address.phone && <p className="mt-1 text-xs">{address.phone}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}