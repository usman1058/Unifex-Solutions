'use client'

import { useEffect, useRef, useState } from 'react'

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
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
    const cursor = cursorRef.current
    if (!cursor || prefersReducedMotion) return

    // Only hide the native cursor after this component has mounted and can
    // provide a replacement. This preserves a usable cursor during hydration
    // and when reduced-motion settings disable the custom cursor.
    document.body.dataset.customCursor = 'true'

    const handleMove = (event: PointerEvent) => {
      // Write the coordinates on the event itself. The old lerp loop made
      // the cursor visibly trail behind fast pointer movement.
      cursor.style.setProperty('--cursor-x', `${event.clientX}px`)
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`)
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

    return () => {
      delete document.body.dataset.customCursor
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerleave', handleLeave)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="unifex-cursor"
        data-active={isVisible ? 'true' : 'false'}
      >
        <span className="unifex-cursor-core" />
        <span className="unifex-cursor-label" />
      </div>
    )
  }
