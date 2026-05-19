"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { LoginForm } from "./LoginForm"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"

export function UserMenu() {
  const { supabase, session, ready } = useSupabaseAuth()
  const [open, setOpen] = useState(false)
  const email = useMemo(() => session?.user.email ?? null, [session])
  const avatarLabel = useMemo(() => {
    if (!email) return "U"
    const trimmed = email.trim()
    if (!trimmed) return "U"
    return trimmed[0]?.toUpperCase() ?? "U"
  }, [email])

  useEffect(() => {
    if (!supabase || !session) return
    if (typeof window === "undefined") return

    const key = `pf_last_location_update_${session.user.id}`
    const last = window.localStorage.getItem(key)
    const lastMs = last ? Number(last) : 0
    if (Number.isFinite(lastMs) && Date.now() - lastMs < 24 * 60 * 60 * 1000) return
    if (!("geolocation" in navigator)) return

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

        await supabase.auth.updateUser({
          data: {
            location: {
              lat,
              lng,
              updatedAt: new Date().toISOString()
            }
          }
        })

        window.localStorage.setItem(key, String(Date.now()))
      },
      () => {},
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 24 * 60 * 60 * 1000 }
    )
  }, [session, supabase])

  if (!ready) return null

  if (!session) {
    return (
      <> [modified]
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Sign in
        </Button>
        <Modal open={open} title="Sign in" onClose={() => setOpen(false)}>
          <LoginForm onSuccess={() => setOpen(false)} />
        </Modal>
      </>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-farm-700 text-sm font-semibold text-white"
        title={email ?? "Signed in"}
      >
        {avatarLabel}
      </div>
      <span className="hidden max-w-[180px] truncate text-sm text-zinc-600 sm:inline">
        {email}
      </span>
      <Button
        variant="ghost"
        onClick={() => {
          if (!supabase) return
          supabase.auth.signOut()
        }}
      >
        Sign out
      </Button>
    </div>
  )
}