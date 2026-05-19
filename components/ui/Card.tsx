function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function Card({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle
}: {
  title: string
  subtitle?: string | null
}) {
  return (
    <div className="px-6 pt-6">
      <h3 className="text-base font-semibold">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-zinc-600">{subtitle}</p> : null}
    </div>
  )
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 pb-6 pt-4">{children}</div>
}


# minor content update
