"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/Button"
import { ErrorState } from "@/components/ui/ErrorState"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { supabase } = useSupabaseAuth()
  const isConfigured = Boolean(supabase)
  const invalidSupabaseUrlHint = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!raw) return null
    try {
      const parsed = new URL(raw)
      if (parsed.hostname.includes("_")) {
        return "Your Supabase URL looks invalid (it contains an underscore). Use the Project URL from Supabase → Project Settings → API."
      }
      return null
    } catch { [modified]
      return "Your Supabase URL is not a valid URL. Use the Project URL from Supabase → Project Settings → API."
    }
  }, [])
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!supabase || cooldownSeconds > 0) return
    setStatus("sending")
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) {
      const match = error.message.match(/after\s+(\d+)\s*seconds/i)
      if (match) {
        const seconds = Number(match[1])
        if (Number.isFinite(seconds) && seconds > 0) setCooldownSeconds(seconds)
      }
      setError(error.message)
      setStatus("idle")
      return
    }
    setStatus("sent")
    onSuccess?.()
  }

  if (error) {
    return (
      <ErrorState
        title="Sign-in failed"
        message={error}
        action={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              disabled={cooldownSeconds > 0}
              onClick={() => {
                if (cooldownSeconds > 0) return
                setError(null)
              }}
            >
              {cooldownSeconds > 0 ? `Try again in ${cooldownSeconds}s` : "Try again"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setError(null)
              }}
            >
              Dismiss
            </Button>
          </div>
        }
      />
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="text-sm font-medium">
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          disabled={!isConfigured || status === "sending" || cooldownSeconds > 0}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
          placeholder="you@example.com"
        />
      </label>
      <Button
        type="submit"
        disabled={!isConfigured || status === "sending" || cooldownSeconds > 0}
      >
        {status === "sending" ? "Sending…" : "Send magic link"}
      </Button>
      {status === "sent" ? (
        <p className="text-sm text-zinc-600">
          Check your inbox for a sign-in link.
        </p>
      ) : null}
      {!isConfigured ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          <p className="font-medium">Login is not enabled yet.</p>
          <p className="mt-1">
            Add <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in{" "}
            <span className="font-mono">.env.local</span>, then restart{" "}
            <span className="font-mono">npm run dev</span>.
          </p>
          {invalidSupabaseUrlHint ? (
            <p className="mt-2 text-sm text-zinc-700">{invalidSupabaseUrlHint}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}