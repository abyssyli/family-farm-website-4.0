import { createClient } from "@supabase/supabase-js"
import { getSupabasePublicConfig, getSupabaseServiceRoleKey } from "./shared"
import type { Database } from "./types"

export function createServerSupabaseClient() {
  const { url, anonKey } = getSupabasePublicConfig()
  let parsed: URL | null = null
  try {
    parsed = new URL(url)
  } catch {
    parsed = null
  }
  if (
    !url ||
    !anonKey ||
    !parsed ||
    parsed.hostname.includes("_") ||
    url.includes("placeholder.supabase.co") ||
    url === "your_supabase_url" ||
    anonKey === "placeholder" ||
    anonKey === "your_supabase_anon_key"
  ) {
    return null
  }
  return createClient<Database>(url, anonKey)
}

export function createServiceRoleSupabaseClient() {
  const { url } = getSupabasePublicConfig()
  const serviceRoleKey = getSupabaseServiceRoleKey()
  let parsed: URL | null = null
  try {
    parsed = new URL(url)
  } catch {
    parsed = null
  }
  if (
    !url ||
    !serviceRoleKey ||
    !parsed ||
    parsed.hostname.includes("_") ||
    url.includes("placeholder.supabase.co") ||
    url === "your_supabase_url" ||
    serviceRoleKey === "your_supabase_service_role_key"
  ) {
    return null
  }
  return createClient<Database>(url, serviceRoleKey)
}

// optimize code detail
