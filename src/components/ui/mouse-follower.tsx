'use client'

import { useEffect, useRef, useState } from 'react'

/** A zero-lag pointer treatment. Position is written directly on pointermove;
 * no requestAnimationFrame interpolation is used, so it never trails the OS cursor. */
export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || reducedMotion) return
    document.body.dataset.customCursor = 'true'
    // Render immediately at the viewport center. This prevents an invisible
    // first frame while the browser is waiting for the first pointer event.
    cursor.style.transform = 'translate3d(50vw, 50vh, 0)'
    cursor.dataset.active = 'true'

    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      cursor.dataset.active = 'true'
      setVisible(true)
      const target = event.target instanceof Element ? event.target.closest('a, button, [role="button"], input, textarea, select') : null
      const heading = event.target instanceof Element ? event.target.closest('h1, h2, h3, h4') : null
      cursor.dataset.hover = target ? 'true' : 'false'
      cursor.dataset.mode = heading ? 'heading' : target ? 'interactive' : 'default'
    }
    const down = () => {
      cursor.dataset.click = 'true'
      window.setTimeout(() => { cursor.dataset.click = 'false' }, 180)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    return () => {
      delete document.body.dataset.customCursor
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
    }
  }, [reducedMotion])

  if (reducedMotion) return null
  return <div ref={cursorRef} aria-hidden="true" className="unifex-cursor" data-active={visible ? 'true' : 'false'}>
    <span className="unifex-cursor-ring" />
    <span className="unifex-cursor-core" />
    <span className="unifex-cursor-label" />
  </div>
}
