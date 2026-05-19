import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardBody } from "@/components/ui/Card"
import { ButtonLink } from "@/components/ui/Button"
import { LikeButton } from "@/components/ui/LikeButton"
import { CommentSection } from "@/components/ui/CommentSection"
import { getCatalog } from "@/lib/catalog"

export default async function JournalPostPage({
  params
}: {
  params: { slug: string }
}) {
  const catalog = await getCatalog()
  const post = catalog.journalPosts.find((p) => p.slug === params.slug)
  if (!post) notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-farm-800">
          <Link href="/journal" className="hover:underline">
            Farm Journal
          </Link>
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {post.title}
          </h1>
          <LikeButton journalPostId={post.id} />
        </div>
        {post.publishedAt ? (
          <p className="mt-2 text-sm text-zinc-600">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        ) : null}
      </div>

      <Card>
        <CardBody>
          <div className="prose prose-zinc max-w-none">
            <p className="whitespace-pre-wrap">{post.body}</p>
          </div> [modified]
        </CardBody>
      </Card>

      <CommentSection journalPostId={post.id} />

      <div>
        <ButtonLink href="/journal" variant="ghost">
          ← Back to journal
        </ButtonLink>
      </div>
    </div>
  )
}
