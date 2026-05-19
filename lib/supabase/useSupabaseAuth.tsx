"use client"

import { useEffect, useMemo, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "./client"

export function useSupabaseAuth() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
 [modified]
  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [supabase])

  return { supabase, session, ready }
}
