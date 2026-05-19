"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Modal } from "@/components/ui/Modal"
import { LikeButton } from "@/components/ui/LikeButton"
import { CommentSection } from "@/components/ui/CommentSection"

type CarouselImage = { src: string; alt: string }

function ImageCarousel({
  images,
}: {
  images: CarouselImage[]
}) {
  const initial = useMemo(() => images.map((i) => i.src), [images])
  const [srcs, setSrcs] = useState<string[]>(initial)
  const [active, setActive] = useState(0)
  const slideCount = images.length
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    setSrcs(images.map((i) => i.src))
    setActive(0)
  }, [images])

  const stopAuto = useCallback(() => {
    if (timerRef.current === null) return
    window.clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const startAuto = useCallback(() => {
    stopAuto()
    if (slideCount <= 1) return
    timerRef.current = window.setInterval(() => {
      setActive((current) => (current + 1) % slideCount)
    }, 6000)
  }, [slideCount, stopAuto])

  useEffect(() => {
    startAuto()
    return () => stopAuto()
  }, [startAuto, stopAuto])

  const goPrev = useCallback(() => {
    setActive((current) => (current - 1 + slideCount) % slideCount)
    startAuto()
  }, [slideCount, startAuto])

  const goNext = useCallback(() => {
    setActive((current) => (current + 1) % slideCount)
    startAuto()
  }, [slideCount, startAuto])

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900/20">
      {images.map((img, idx) => (
        <Image
          key={img.src}
          src={srcs[idx] ?? img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-opacity duration-700 ${
            idx === active ? "opacity-100" : "opacity-0"
          }`}
          onError={() => {
            const cur = srcs[idx] ?? img.src
            if (!cur.endsWith(".png")) return
            setSrcs((prev) => {
              const next = [...prev]
              next[idx] = cur.replace(/\.png$/i, ".jpg")
              return next
            })
          }}
          priority={idx === 0}
        />
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-zinc-950/10 to-zinc-950/10"
        aria-hidden="true"
      />
      {slideCount > 1 ? (
        <div className="absolute inset-0 flex items-center justify-between p-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            aria-label="Previous slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-950/45 text-white backdrop-blur transition hover:bg-zinc-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            aria-label="Next slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-950/45 text-white backdrop-blur transition hover:bg-zinc-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function UpdatesPage() {
  const planetImages: CarouselImage[] = useMemo(
    () => [
      { src: "/photos/new.png", alt: "What’s new in Hands’s Planet - 1" },
      { src: "/photos/new1.png", alt: "What’s new in Hands’s Planet - 2" },
      { src: "/photos/new2.png", alt: "What’s new in Hands’s Planet - 3" }
    ],
    []
  )

  const updates = useMemo(
    () => [
      {
        id: "update-farm-weekly",
        title: "What’s new this week on the farm",
        summary: "Summer is coming! The chickens enjoy iced watermelon.",
        cover: { src: "/photos/farm1.jpg", alt: "What’s new this week on the farm" },
        images: [{ src: "/photos/farm1.jpg", alt: "What’s new this week on the farm" }]
      },
      {
        id: "update-hands-village",
        title: "News from the Hands Village",
        summary: "Congratulations on Thomas’s graduation!",
        cover: { src: "/photos/village1.jpg", alt: "News from the Hands Village" },
        images: [{ src: "/photos/village1.jpg", alt: "News from the Hands Village" }]
      },
      {
        id: "update-hands-planet",
        title: "What’s new in Hands’s Planet",
        summary: "New screenshots from Hands’s Planet.",
        cover: { src: "/photos/new.png", alt: "What’s new in Hands’s Planet" },
        images: planetImages
      }
    ],
    [planetImages]
  )

  const [openId, setOpenId] = useState<string | null>(null)
  const activeUpdate = useMemo(() => updates.find((u) => u.id === openId) ?? null, [openId, updates])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Updates
        </h1>
        <p className="mt-2 text-sm text-zinc-700">
          The latest notes from the farm and Hands&apos; Village.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {updates.map((u) => (
          <div
            key={u.id}
            role="button"
            tabIndex={0}
            className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-farm-700"
            aria-label={`Open ${u.title}`}
            onClick={() => setOpenId(u.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpenId(u.id)
            }}
          >
            <Card className="group h-full overflow-hidden transition hover:border-zinc-300">
              <div className="relative h-44 w-full">
                {u.id === "update-hands-planet" ? (
                  <ImageCarousel images={u.images} />
                ) : (
                  <Image src={u.cover.src} alt={u.cover.alt} fill className="object-cover" />
                )}
                <div
                  className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/5"
                  aria-hidden="true"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold">{u.title}</h3>
                <p className="mt-2 text-sm text-zinc-700">{u.summary}</p>
                <p className="mt-4 text-sm font-medium text-farm-800">View →</p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Modal
        open={activeUpdate !== null}
        title={activeUpdate?.title ?? "Update"}
        onClose={() => setOpenId(null)}
        className="max-w-4xl"
      >
        {activeUpdate ? (
          <div className="max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="text-sm text-zinc-600">{activeUpdate.summary}</div>
              <LikeButton journalPostId={activeUpdate.id} />
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200">
              <div className="relative h-72 w-full sm:h-[420px]">
                {activeUpdate.images.length > 1 ? (
                  <ImageCarousel images={activeUpdate.images} />
                ) : (
                  <Image
                    src={activeUpdate.images[0]!.src}
                    alt={activeUpdate.images[0]!.alt}
                    fill
                    className="object-contain bg-zinc-50"
                    sizes="(min-width: 1024px) 900px, 100vw"
                  />
                )}
              </div>
            </div>

            <CommentSection journalPostId={activeUpdate.id} />
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
