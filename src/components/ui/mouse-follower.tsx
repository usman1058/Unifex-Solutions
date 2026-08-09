'use client'

import { useEffect, useRef } from 'react'

export function MouseFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y

    const render = () => {
      x += (targetX - x) * 0.42
      y += (targetY - y) * 0.42
      cursor.style.setProperty('--cursor-x', `${x}px`)
      cursor.style.setProperty('--cursor-y', `${y}px`)
      frame = requestAnimationFrame(render)
    }

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
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

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerdown', handleDown, { passive: true })
    frame = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={cursorRef} aria-hidden="true" className="unifex-cursor">
      <span className="unifex-cursor-trail unifex-cursor-trail-one" />
      <span className="unifex-cursor-trail unifex-cursor-trail-two" />
      <span className="unifex-cursor-halo" />
      <span className="unifex-cursor-core" />
      <span className="unifex-cursor-label" />
    </div>
  )
}
