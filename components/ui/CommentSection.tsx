"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"
import Image from "next/image"

export function CommentSection({
  productId,
  journalPostId
}: {
  productId?: string
  journalPostId?: string
}) {
  const { supabase, session } = useSupabaseAuth()
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (supabase) {
      fetchComments()
    }
  }, [supabase, productId, journalPostId])

  async function fetchComments() {
    if (!supabase) return
    let query = supabase
      .from("comments")
      .select("*, profiles:user_id(email)") // Assuming a profiles view or just email
      .order("created_at", { ascending: false })
    
    if (productId) query = query.eq("product_id", productId)
    if (journalPostId) query = query.eq("journal_post_id", journalPostId)

    const { data, error } = await query
    if (!error && data) {
      setComments(data)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase || !session || !newComment.trim()) return

    setIsSubmitting(true)
    const { error } = await supabase.from("comments").insert({
      user_id: session.user.id,
      content: newComment.trim(),
      product_id: productId || null,
      journal_post_id: journalPostId || null
    })

    if (!error) {
      setNewComment("")
      fetchComments()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="mt-12 flex flex-col gap-8 border-t border-zinc-200 pt-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Comments & Reviews</h2>
        <p className="text-sm text-zinc-600">
          Share your experience with this {productId ? "dish" : "story"}.
        </p>
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-700/20"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="self-start">
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <div className="rounded-2xl bg-zinc-50 p-6 text-center">
          <p className="text-sm text-zinc-600">
            Please sign in to leave a comment.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-2 rounded-2xl bg-zinc-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">
                  {comment.profiles?.email?.split("@")[0] || "User"}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-zinc-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* minor adjust */
