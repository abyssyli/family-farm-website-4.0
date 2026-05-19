"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card } from "@/components/ui/Card"

type MapPoint = {
  id: string
  label: string
  lat: number
  lng: number
  count: number
}

function projectEquirectangular(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return { x, y }
}

function formatCount(count: number) {
  if (count === 1) return "1 user"
  return `${count} users`
}

export function WorldUserMap() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [points, setPoints] = useState<MapPoint[]>([])
  const [status, setStatus] = useState<"loading" | "ok" | "disabled" | "error">("loading")
  const [message, setMessage] = useState<string | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      const width = Math.max(0, Math.floor(rect.width))
      const height = Math.max(0, Math.floor((rect.width * 9) / 16))
      setSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let active = true
    setStatus("loading")
    fetch("/api/user-map")
      .then((res) => res.json())
      .then((json: { points?: MapPoint[]; status?: string; message?: string }) => {
        if (!active) return
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
      })
      .catch((err: unknown) => {
        if (!active) return
        setStatus("error")
        setMessage(err instanceof Error ? err.message : "Failed to load map data.")
      })
    return () => {
      active = false
    }
  }, [])

  const legend = useMemo(() => {
    if (status === "loading") return "Loading user locations…"
    if (status === "disabled") return message ?? "Map is disabled."
    if (status === "error") return message ?? "Map data is unavailable."
    if (points.length === 0) return "No locations yet."
    return `${points.length} users shown`
  }, [message, points.length, status])

  const usable = size.width > 0 && size.height > 0
  const shouldRender = status === "ok" && points.length > 0

  if (!shouldRender) return null

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">User World Map</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Each user’s location is shown on the world map.
          </p>
        </div>
        <p className="text-sm text-zinc-700">{legend}</p>
      </div>
      <Card className="overflow-hidden">
        <div ref={containerRef} className="relative w-full">
          <div
            className="relative w-full bg-gradient-to-b from-zinc-50 to-white"
            style={{ height: usable ? size.height : 320 }}
          > [modified]
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(24,24,27,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px"
              }}
            />

            {usable
              ? points.map((p) => {
                  const { x, y } = projectEquirectangular(p.lat, p.lng, size.width, size.height)
                  const left = Math.min(size.width - 8, Math.max(0, x))
                  const top = Math.min(size.height - 8, Math.max(0, y))
                  return (
                    <div
                      key={p.id}
                      className="group absolute"
                      style={{ left, top, transform: "translate(-50%, -50%)" }}
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-farm-700 ring-2 ring-white shadow" />
                      <div className="pointer-events-none absolute left-1/2 top-3 hidden -translate-x-1/2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 shadow-sm group-hover:block">
                        <div className="font-semibold">{p.label}</div>
                        <div className="mt-0.5 text-zinc-600">{formatCount(p.count)}</div>
                      </div>
                    </div>
                  )
                })
              : null}
          </div>
        </div>
      </Card>
      <p className="text-xs text-zinc-500">
        Pins are based on the user’s saved location (lat/lng) captured via browser permission.
      </p>
    </section>
  )
}