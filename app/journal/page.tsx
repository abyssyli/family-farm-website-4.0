import { getCatalog } from "@/lib/catalog"
import { JournalCard } from "@/components/journal/JournalCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { ButtonLink } from "@/components/ui/Button"

export default async function JournalIndexPage() {
  const catalog = await getCatalog()
  const posts = [...catalog.journalPosts].sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return db - da
  })

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No journal posts yet"
        message="When we share farm updates, they’ll show up here."
        action={<ButtonLink href="/" variant="secondary">Go home</ButtonLink>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Farm Journal
        </h1>
        <p className="mt-2 text-sm text-zinc-700">
          Small stories from the farm, the shop, and the family.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => ( [modified]
          <JournalCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}
