'use client'

import { useEffect, useRef, useState } from 'react'

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || prefersReducedMotion) return

    let frame = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y
    let isMoving = false

    const render = () => {
      const dx = targetX - x
      const dy = targetY - y
      
      // Only animate if there's meaningful movement
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        x += dx * 0.35
        y += dy * 0.35
        cursor.style.setProperty('--cursor-x', `${x}px`)
        cursor.style.setProperty('--cursor-y', `${y}px`)
        isMoving = true
      } else if (isMoving) {
        isMoving = false
      }
      
      frame = requestAnimationFrame(render)
    }

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      
      if (!isVisible) setIsVisible(true)
      
      const element = event.target instanceof Element ? event.target : null
      const target = element?.closest('a, button, [role="button"], input, textarea, select')
      const heading = element?.closest('h1, h2, h3, h4')
      cursor.dataset.hover = target ? 'true' : 'false'
      cursor.dataset.mode = heading ? 'heading' : target ? 'interactive' : 'default'
      cursor.dataset.active = 'true'
    }

    const handleDown = () => {
      cursor.dataset.click = 'true'
      window.setTimeout(() => { if (cursor) cursor.dataset.click = 'false' }, 420)
    }

    const handleLeave = () => {
      setIsVisible(false)
      cursor.dataset.active = 'false'
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerdown', handleDown, { passive: true })
    window.addEventListener('pointerleave', handleLeave, { passive: true })
    frame = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerleave', handleLeave)
      cancelAnimationFrame(frame)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <div 
      ref={cursorRef} 
      aria-hidden="true" 
      className="unifex-cursor"
      style={{ opacity: 0 }}
    >
      <span className="unifex-cursor-core" />
    </div>
  )
}
