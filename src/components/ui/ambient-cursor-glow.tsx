'use client'

import { useEffect, useRef, useState } from 'react'

export default function AmbientCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const glow = glowRef.current
    if (!glow || prefersReducedMotion) return

    let frame = 0
    let targetX = window.innerWidth * 0.78
    let targetY = window.innerHeight * 0.12
    let currentX = targetX
    let currentY = targetY

    const render = () => {
      currentX += (targetX - currentX) * 0.05
      currentY += (targetY - currentY) * 0.05
      glow.style.setProperty('--cursor-x', `${currentX}px`)
      glow.style.setProperty('--cursor-y', `${currentY}px`)
      glow.style.setProperty('--pull-y', `${(window.innerHeight / 2 - currentY) * 0.02}px`)
      frame = requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      glow.dataset.active = 'true'
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    frame = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      cancelAnimationFrame(frame)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return <div ref={glowRef} aria-hidden="true" className="ambient-cursor-glow" />
}
