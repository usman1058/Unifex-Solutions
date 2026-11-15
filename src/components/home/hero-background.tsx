'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const FloatingLines = dynamic(() => import('@/components/ui/floating-lines'), { ssr: false })

export default function HeroBackground() {
  const reduceMotion = useReducedMotion()
  const [supportsDesktopCanvas, setSupportsDesktopCanvas] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const update = () => setSupportsDesktopCanvas(query.matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,184,123,0.12),transparent_32%),linear-gradient(160deg,#0a0a0a,#14100c_55%,#0a0a0a)]">
      {supportsDesktopCanvas && !reduceMotion && <FloatingLines
        linesGradient={['#F97316', '#F97316', '#6a6a6a']}
        enabledWaves={['top', 'middle', 'bottom']}
        lineCount={8}
        lineDistance={8}
        bendRadius={8}
        bendStrength={-2}
        interactive
        parallax={true}
        animationSpeed={1}
        mixBlendMode="screen"
      />}
    </div>
  )
}
