import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CONTACT_PHONE: z.string().default("+1 (806) 290-4949"),
  NEXT_PUBLIC_SKINCARE_URL: z.string().url().default("https://beakergold.com/"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

export type Env = z.infer<typeof envSchema>

let cachedEnv: Env | null = null

export function getEnv(): Env {
  if (process.env.NODE_ENV === "production" && cachedEnv) return cachedEnv

  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    NEXT_PUBLIC_SKINCARE_URL: process.env.NEXT_PUBLIC_SKINCARE_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })

  if (!result.success) {
    const message = ["❌ Invalid environment variables:", result.error.format()]
    if (process.env.NODE_ENV === "production") {
      console.error(...message)
    } else {
      console.warn(...message)
    }
    // In production, we might want to throw an error
    // throw new Error("Invalid environment variables")
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder",
    })
  }

  if (process.env.NODE_ENV === "production") {
    cachedEnv = result.data
  }
  return result.data
}

export function getPublicEnv() {
  const env = getEnv()
  return {
    contactPhone: env.NEXT_PUBLIC_CONTACT_PHONE,
    skincareUrl: env.NEXT_PUBLIC_SKINCARE_URL,
  }
}

// update log: auto edit 01
