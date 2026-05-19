"use client"

import { useEffect, useState } from "react"
import { useSupabaseAuth } from "@/lib/supabase/useSupabaseAuth"

export function LikeButton({ journalPostId }: { journalPostId: string }) {
  const { supabase, session } = useSupabaseAuth()
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (supabase) {
      fetchLikes()
    }
  }, [supabase, journalPostId, session])

  async function fetchLikes() {
    if (!supabase) return
    
    // Get total likes
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("journal_post_id", journalPostId)
    
    if (!error) setLikes(count || 0)

    // Check if user liked
    if (session) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("journal_post_id", journalPostId)
        .eq("user_id", session.user.id)
        .single()
      setIsLiked(!!data)
    }
  }

  async function toggleLike() {
    if (!supabase || !session || isUpdating) return
    setIsUpdating(true)

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("journal_post_id", journalPostId)
        .eq("user_id", session.user.id)
    } else {
      await supabase.from("likes").insert({
        journal_post_id: journalPostId,
        user_id: session.user.id
      })
    }

    await fetchLikes()
    setIsUpdating(false)
  }

  return (
    <button
      onClick={toggleLike}
      disabled={!session || isUpdating}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${
        isLiked
          ? "border-farm-200 bg-farm-50 text-farm-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      } ${!session ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        />
      </svg>
      <span className="font-medium">{likes}</span>
    </button>
  )
}

// update log: auto edit 01
