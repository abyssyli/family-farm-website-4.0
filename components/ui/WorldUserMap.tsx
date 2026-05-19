"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"

type MapPoint = {
  id: string
  label: string
  lat: number
  lng: number
  count: number
}

function stableId(input: string) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return `loc_${(hash >>> 0).toString(16)}`
}

function formatCoord(value: number) {
  return value.toFixed(4)
}

export function WorldUserMap() {
  const { supabase, session, ready } = useSupabaseAuth()
  const [points, setPoints] = useState<MapPoint[]>([])
  const [status, setStatus] = useState<"loading" | "ok" | "disabled" | "error">("loading")
  const [message, setMessage] = useState<string | null>(null)
  const [myCoords, setMyCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [myStatus, setMyStatus] = useState<
    "idle" | "requesting" | "granted" | "denied" | "error"
  >("idle")
  const [myMessage, setMyMessage] = useState<string | null>(null)

  async function loadPoints(signal?: AbortSignal) {
    setStatus("loading")
    try {
      const res = await fetch("/api/user-map", { signal })
      const json = (await res.json()) as {
        points?: MapPoint[]
        status?: string
        message?: string
      }
      const nextPoints = Array.isArray(json.points) ? json.points : []
      setPoints(nextPoints)
      if (json.status === "disabled") {
        setStatus("disabled")
        setMessage(json.message ?? null)
        return
      }
      if (json.status === "error") {
        setStatus("error")
        setMessage(json.message ?? null)
        return
      }
      setStatus("ok")
      setMessage(null)
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Failed to load locations.")
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadPoints(controller.signal).catch(() => null)
    return () => controller.abort()
  }, [])

  async function requestAndSaveLocation() {
    if (!ready || !session || !supabase) return
    if (!("geolocation" in navigator)) {
      setMyStatus("error")
      setMyMessage("This browser does not support location.")
      return
    }

    setMyStatus("requesting")
    setMyMessage(null)

    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000
      })
    }).catch((err: unknown) => {
      if (err && typeof err === "object" && "code" in err && (err as any).code === 1) {
        setMyStatus("denied")
        setMyMessage("Location permission was denied.")
      } else {
        setMyStatus("error")
        setMyMessage(err instanceof Error ? err.message : "Failed to get location.")
      }
      return null
    })

    if (!pos) return

    const next = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    setMyCoords(next)
    setMyStatus("granted")
    setMyMessage(null)

    const storageKey = `farm_location_prompted_v1:${session.user.id}`
    localStorage.setItem(storageKey, "1")

    await supabase.auth.updateUser({
      data: {
        location: { lat: next.lat, lng: next.lng, updatedAt: new Date().toISOString() }
      }
    })
    await loadPoints()
  }

  useEffect(() => {
    if (!ready) return
    if (!session || !supabase) {
      setMyCoords(null)
      setMyStatus("idle")
      setMyMessage(null)
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>
      const location = meta.location as { lat?: unknown; lng?: unknown } | undefined
      const rawLat = location?.lat
      const rawLng = location?.lng
      const lat = typeof rawLat === "number" ? rawLat : Number(rawLat)
      const lng = typeof rawLng === "number" ? rawLng : Number(rawLng)
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setMyCoords({ lat, lng })
        setMyStatus("granted")
        setMyMessage(null)
        return
      }
      setMyStatus("idle")
      setMyMessage(null)
    })
  }, [ready, session?.user.id, supabase])

  const myId = session ? stableId(session.user.id) : null
  const orderedPoints = useMemo(() => {
    const next = [...points]
    next.sort((a, b) => {
      if (myId && a.id === myId && b.id !== myId) return -1
      if (myId && b.id === myId && a.id !== myId) return 1
      return a.id.localeCompare(b.id)
    })
    return next
  }, [myId, points])

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">User Locations</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Share your location and we&apos;ll show it as text.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => loadPoints().catch(() => null)}>
          Refresh
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-zinc-900">Your location</div>
            {!ready ? (
              <div className="text-sm text-zinc-700">Loading…</div>
            ) : !session ? (
              <div className="text-sm text-zinc-700">Sign in to share your location.</div>
            ) : myCoords ? (
              <div className="text-sm text-zinc-700">
                Lat {formatCoord(myCoords.lat)}, Lng {formatCoord(myCoords.lng)}
              </div>
            ) : (
              <div className="text-sm text-zinc-700">No location saved yet.</div>
            )}
          </div>

          {ready && session ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={myStatus === "requesting"}
                onClick={() => requestAndSaveLocation().catch(() => null)}
              >
                {myStatus === "requesting" ? "Requesting…" : "Share location"}
              </Button>
              {myStatus === "denied" ? (
                <span className="text-xs text-zinc-500">Permission denied in browser settings.</span>
              ) : null}
            </div>
          ) : null}

          {myMessage ? <div className="text-xs text-zinc-500">{myMessage}</div> : null}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-zinc-900">Community locations</div>
          {status === "loading" ? (
            <div className="text-sm text-zinc-700">Loading…</div>
          ) : status === "disabled" ? (
            <div className="text-sm text-zinc-700">{message ?? "Locations are disabled."}</div>
          ) : status === "error" ? (
            <div className="text-sm text-zinc-700">{message ?? "Failed to load locations."}</div>
          ) : orderedPoints.length === 0 ? (
            <div className="text-sm text-zinc-700">No community locations yet.</div>
          ) : (
            <ul className="flex flex-col gap-2 text-sm text-zinc-700">
              {orderedPoints.slice(0, 50).map((p) => {
                const isMe = myId ? p.id === myId : false
                return (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-medium text-zinc-900">{isMe ? "You" : p.label}</span>
                    <span>
                      Lat {formatCoord(p.lat)}, Lng {formatCoord(p.lng)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Card>
    </section>
  )
}
