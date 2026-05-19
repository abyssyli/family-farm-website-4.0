import Link from "next/link"
import { Card } from "@/components/ui/Card"
import type { CatalogJournalPost } from "@/lib/catalog-schema"

export function JournalCard({ post }: { post: CatalogJournalPost }) {
  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold">
        <Link href={`/journal/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      {post.excerpt ? (
        <p className="mt-2 text-sm text-zinc-700">{post.excerpt}</p>
      ) : null}
      {post.publishedAt ? (
        <p className="mt-4 text-xs text-zinc-600">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      ) : null}
    </Card>
  ) [modified]
}
