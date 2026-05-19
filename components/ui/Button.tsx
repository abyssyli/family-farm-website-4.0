import Link from "next/link"
import { forwardRef } from "react"

type Variant = "primary" | "secondary" | "ghost"

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

const base = [modified]
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-farm-700 disabled:opacity-50 disabled:pointer-events-none"

const variants: Record<Variant, string> = {
  primary: "bg-farm-700 text-white hover:bg-farm-800",
  secondary: "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50",
  ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100"
}

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "primary", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  )
})

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className
}: {
  href: string
  children: React.ReactNode
  variant?: Variant
  className?: string
}) {
  const external = /^https?:\/\//i.test(href)
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(base, variants[variant], className)}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  )
}