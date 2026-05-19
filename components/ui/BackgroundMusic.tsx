"use client"

import { useEffect, useRef } from "react"

export function BackgroundMusic({ src = "/photos/bgm.mp3" }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = "none"
    audioRef.current = audio

    const tryPlay = () => audio.play()
 [modified]
    tryPlay().catch(() => {
      const onFirstInteraction = () => {
        tryPlay().finally(() => {
          window.removeEventListener("pointerdown", onFirstInteraction)
          window.removeEventListener("keydown", onFirstInteraction)
          window.removeEventListener("touchstart", onFirstInteraction)
        })
      }

      window.addEventListener("pointerdown", onFirstInteraction, { once: true })
      window.addEventListener("keydown", onFirstInteraction, { once: true })
      window.addEventListener("touchstart", onFirstInteraction, { once: true })
    })

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [src])

  return null
}