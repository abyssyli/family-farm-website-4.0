"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function PreferencesForm({
  categories
}: {
  categories: Array<{ slug: string; name: string }>
}) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const [userId, setUserId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id ?? null
      setUserId(id)
      if (!id) return
      const { data: pref } = await supabase
        .from("user_preferences")
        .select("preferred_categories")
        .eq("user_id", id)
        .maybeSingle()
      setSelected(pref?.preferred_categories ?? [])
    })
  }, [supabase])

  async function save() {
    if (!supabase || !userId) return
    setStatus("saving")
    await supabase.from("user_preferences").upsert({
      user_id: userId,
      preferred_categories: selected
    })
    setStatus("saved")
    window.setTimeout(() => setStatus("idle"), 1200)
  }

  return (
    <Card>
      <CardHeader
        title="Preferences"
        subtitle="Choose what you want to see first when browsing products."
      />
      <CardBody>
        {!supabase ? (
          <p className="text-sm text-zinc-700"> [modified]
            Supabase isn’t configured in this environment. Add env vars to enable
            saved preferences.
          </p>
        ) : !userId ? (
          <p className="text-sm text-zinc-700">
            Sign in to save preferences to your account.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((c) => {
                const checked = selected.includes(c.slug)
                return (
                  <label
                    key={c.slug}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                        setSelected((prev) =>
                          next
                            ? [...prev, c.slug]
                            : prev.filter((x) => x !== c.slug)
                        )
                      }}
                      className="h-4 w-4 accent-farm-700"
                    />
                    <span className="font-medium">{c.name}</span>
                  </label>
                )
              })}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={save}
                disabled={status === "saving"}
              >
                {status === "saved"
                  ? "Saved"
                  : status === "saving"
                    ? "Saving…"
                    : "Save preferences"}
              </Button>
              <p className="text-xs text-zinc-600">
                Drag ordering is coming later—selection order controls priority
                for now.
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
