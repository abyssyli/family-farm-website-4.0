"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"

export function SundayRSVP() {
  const { supabase, session } = useSupabaseAuth()
  const [rsvp, setRsvp] = useState<any>(null)
  const [adultCount, setAdultCount] = useState(1)
  const [childCount, setChildCount] = useState(0)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")

  // Next Sunday's date
  const nextSunday = new Date()
  nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7))
  const dateStr = nextSunday.toISOString().split("T")[0]

  useEffect(() => {
    if (supabase && session) {
      fetchRSVP()
    }
  }, [supabase, session])

  async function fetchRSVP() {
    if (!supabase || !session) return
    const { data, error } = await supabase
      .from("sunday_rsvps")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("event_date", dateStr)
      .single()
    
    if (!error && data) {
      setRsvp(data)
      setAdultCount(data.adult_count)
      setChildCount(data.child_count)
      setNotes(data.notes || "")
    }
  }

  async function handleRSVP() {
    if (!supabase || !session) return
    setStatus("saving")

    const rsvpData = {
      user_id: session.user.id,
      event_date: dateStr,
      adult_count: adultCount,
      child_count: childCount,
      notes: notes || null
    }

    const { error } = await supabase
      .from("sunday_rsvps")
      .upsert(rsvpData, { onConflict: "user_id,event_date" })

    if (!error) {
      setStatus("saved")
      fetchRSVP()
      setTimeout(() => setStatus("idle"), 3000)
    } else {
      setStatus("idle")
    }
  }

  return (
    <Card className="border-farm-200 bg-farm-50/30">
      <CardHeader
        title="Sunday Family Gathering"
        subtitle={`RSVP for our next gathering on Sunday, ${new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.`}
      />
      <CardBody>
        {!session ? (
          <p className="text-sm text-zinc-600 italic">
            Please sign in to RSVP for the family gathering.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Adults
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={adultCount}
                  onChange={(e) => setAdultCount(parseInt(e.target.value) || 1)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Children
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={childCount}
                  onChange={(e) => setChildCount(parseInt(e.target.value) || 0)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm font-medium"> [modified]
              Special Notes (Dietary needs, etc.)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Optional..."
                className="rounded-xl border border-zinc-200 px-3 py-2 outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
              />
            </label>
            <div className="flex items-center gap-4">
              <Button onClick={handleRSVP} disabled={status === "saving"}>
                {status === "saved" ? "RSVP Updated!" : status === "saving" ? "Saving..." : rsvp ? "Update RSVP" : "Confirm RSVP"}
              </Button>
              {rsvp && (
                <p className="text-xs text-farm-700 font-medium">
                  ✓ You are registered for this Sunday!
                </p>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}