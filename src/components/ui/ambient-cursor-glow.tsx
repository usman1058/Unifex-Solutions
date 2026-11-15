'use client'

import { useEffect, useRef, useState } from 'react'

export default function AmbientCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const glow = glowRef.current
    if (!glow || prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return

    const handlePointerMove = (event: PointerEvent) => {
      glow.style.setProperty('--cursor-x', `${event.clientX}px`)
      glow.style.setProperty('--cursor-y', `${event.clientY}px`)
      glow.style.setProperty('--pull-y', `${(window.innerHeight / 2 - event.clientY) * 0.02}px`)
      glow.dataset.active = 'true'
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return <div ref={glowRef} aria-hidden="true" className="ambient-cursor-glow" />
}
