'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    // Keep native touch scrolling on phones and tablets. Lenis is used for
    // mouse-wheel input only, where its interpolation helps without slowing
    // down swipe gestures or assistive scrolling.
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || coarsePointer || window.innerWidth < 768) return

    const lenis = new Lenis({
      duration: 0.62,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1.25,
      infinite: false,
    })

    let frame = 0
    function raf(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return null
}
