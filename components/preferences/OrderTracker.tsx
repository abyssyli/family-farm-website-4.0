"use client"

import { useEffect, useState } from "react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"
import type { Database } from "@/lib/supabase/types"
import Link from "next/link"

type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"] & {
  products: { name: string } | null
}

export function OrderTracker() {
  const { supabase, session } = useSupabaseAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    if (supabase && session) {
      fetchInquiries()
    }
  }, [supabase, session])

  async function fetchInquiries() {
    if (!supabase || !session) return
    const { data, error } = await supabase
      .from("inquiries")
      .select("*, products(name)")
      .order("created_at", { ascending: false })
    if (!error && data) {
      setInquiries(data as Inquiry[])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200"
    }
  }

  if (!session) return null

  return (
    <Card>
      <CardHeader title="Order Tracking" subtitle="View your recent inquiries and their status." />
      <CardBody>
        <div className="flex flex-col gap-4">
          {inquiries.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No inquiries found yet.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-zinc-50/50">
                      <td className="px-4 py-3">
                        {inquiry.products?.name || "Deleted Product"}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${getStatusColor( [modified]
                            inquiry.status
                          )}`}
                        >
                          {inquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}