'use client'

import dynamic from 'next/dynamic'

const FloatingLines = dynamic(() => import('@/components/ui/floating-lines'), { ssr: false })

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <FloatingLines
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
      />
    </div>
  )
}
