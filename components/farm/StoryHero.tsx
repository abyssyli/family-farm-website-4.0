"use client"

import Image from "next/image"
import { ButtonLink } from "@/components/ui/Button"
import { useCallback, useEffect, useRef, useState } from "react"

export function StoryHero() {
  const backgroundSlides = ["/photos/background.jpg", "/photos/background1.jpg"] as const
  const [hoursSlide, setHoursSlide] = useState(0)
  const slideCount = backgroundSlides.length
  const timerRef = useRef<number | null>(null)

  const stopAuto = useCallback(() => {
    if (timerRef.current === null) return
    window.clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const startAuto = useCallback(() => {
    stopAuto()
    timerRef.current = window.setInterval(() => {
      setHoursSlide((current) => (current + 1) % slideCount)
    }, 6000)
  }, [slideCount, stopAuto])

  useEffect(() => {
    startAuto()
    return () => stopAuto()
  }, [startAuto, stopAuto])

  const goPrev = useCallback(() => {
    setHoursSlide((current) => (current - 1 + slideCount) % slideCount)
    startAuto()
  }, [slideCount, startAuto])

  const goNext = useCallback(() => {
    setHoursSlide((current) => (current + 1) % slideCount)
    startAuto()
  }, [slideCount, startAuto])

  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-sm font-medium text-farm-800">
          Texas family farm · Chicken and Eggs · Woodcraft · Skincare
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          A warm marketplace built around our family and the land we care for.
        </h1>
        <p className="mt-4 max-w-prose text-base text-zinc-700">
          Paula is a mom of 10 and grandma to 11. She founded the Rushing
          homeschool and runs Paula’s farm business with a full-house kind of
          warmth. Chicken and eggs come straight from the coop, woodcraft comes
          from the family shop, and Lisa’s skincare connects to our natural, small-batch
          way of life.
        </p>
        <div className="mt-5 max-w-prose rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-700">
          Business hours: 7:00 AM – 10:00 PM
        </div>
        <div
          className="relative mt-5 h-40 max-w-prose overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900/20 sm:h-52"
        >
          {backgroundSlides.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt="Farm background"
              fill
              sizes="(min-width: 1024px) 520px, (min-width: 640px) 520px, 100vw"
              className={`object-cover transition-opacity duration-700 ${
                index === hoursSlide ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0}
            />
          ))}
          <div
            className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-zinc-950/10 to-zinc-950/10"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-950/45 text-white backdrop-blur transition hover:bg-zinc-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-950/45 text-white backdrop-blur transition hover:bg-zinc-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/products">Browse products</ButtonLink>
          <ButtonLink href="/products/eggs" variant="secondary">
            See today’s eggs
          </ButtonLink>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <Image
          src="/photos/Home.jpg"
          alt="Paula’s farm home"
          width={1200}
          height={900}
          className="h-[320px] w-full object-cover sm:h-[420px]"
          priority
        />
      </div>
    </section>
  )
}

/* minor adjust */
