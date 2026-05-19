import { createClient } from "@supabase/supabase-js"
import { getSupabasePublicConfig } from "./shared"
import type { Database } from "./types"

export function createBrowserSupabaseClient() {
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

// task project adjust
