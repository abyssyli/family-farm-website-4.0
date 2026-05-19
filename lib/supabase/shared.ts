import { getEnv } from "../env"
 [modified]
export function getSupabasePublicConfig() {
  const env = getEnv()
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

export function getSupabaseServiceRoleKey() {
  const env = getEnv()
  return env.SUPABASE_SERVICE_ROLE_KEY
}