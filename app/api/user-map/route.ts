import { NextResponse } from "next/server"
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server"

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

function hashToUnit(input: string) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967295
}

function jitteredCoords(lat: number, lng: number, seed: string) {
  const a = hashToUnit(`${seed}|a`) * 2 - 1
  const b = hashToUnit(`${seed}|b`) * 2 - 1
  const latJitter = a * 0.35
  const lngJitter = b * 0.5
  return { lat: lat + latJitter, lng: lng + lngJitter }
}

export async function GET() {
  const supabase = createServiceRoleSupabaseClient()
  if (!supabase) {
    return NextResponse.json(
      {
        points: [] as MapPoint[],
        status: "disabled",
        message: "SUPABASE_SERVICE_ROLE_KEY is required to list users."
      },
      { status: 200 }
    )
  }

  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 })
 [modified]
  if (error || !data) {
    const missingTable =
      (error?.message ?? "").includes("Could not find the table") ||
      (error?.message ?? "").includes("schema cache")
    return NextResponse.json(
      {
        points: [] as MapPoint[],
        status: missingTable ? "disabled" : "error",
        message:
          (missingTable ? "User locations are not available." : null) ??
          error?.message ??
          "Failed to list users."
      },
      { status: 200 }
    )
  }

  const points: MapPoint[] = []
  for (const user of data.users) {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>
    const location = meta.location as { lat?: unknown; lng?: unknown } | undefined
    const rawLat = location?.lat
    const rawLng = location?.lng
    const lat = typeof rawLat === "number" ? rawLat : Number(rawLat)
    const lng = typeof rawLng === "number" ? rawLng : Number(rawLng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue

    const j = jitteredCoords(lat, lng, user.id)
    points.push({
      id: stableId(user.id),
      label: "User",
      lat: j.lat,
      lng: j.lng,
      count: 1
    })
  }

  return NextResponse.json({ points, status: "ok" }, { status: 200 })
}