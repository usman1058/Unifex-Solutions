'use client'

import { useEffect, useRef } from 'react'

export default function AmbientCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let targetX = window.innerWidth * 0.78
    let targetY = window.innerHeight * 0.12
    let currentX = targetX
    let currentY = targetY

    const render = () => {
      currentX += (targetX - currentX) * 0.075
      currentY += (targetY - currentY) * 0.075
      glow.style.setProperty('--cursor-x', `${currentX}px`)
      glow.style.setProperty('--cursor-y', `${currentY}px`)
      glow.style.setProperty('--pull-y', `${(window.innerHeight / 2 - currentY) * 0.028}px`)
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
  }, [])

  return <div ref={glowRef} aria-hidden="true" className="ambient-cursor-glow" />
}
