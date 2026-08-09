'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface HomepageClientMotionProps {
  children: ReactNode
  type: 'hero' | 'marquee' | 'parallax-bg'
  className?: string
}

function HeroParallax({ children, className = '', shouldReduceMotion }: { children: ReactNode; className?: string; shouldReduceMotion: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => { setReady(true) }, [])

  const { scrollYProgress } = useScroll({
    target: ready ? containerRef : undefined,
    offset: ['start start', 'end start'],
  })
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <motion.div
      ref={containerRef}
      style={{ y: shouldReduceMotion || !ready ? 0 : yParallax }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function MarqueeStrip({ children, className = '', shouldReduceMotion }: { children: ReactNode; className?: string; shouldReduceMotion: boolean }) {
  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <motion.div
        animate={shouldReduceMotion ? {} : { x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 35,
            ease: 'linear',
          },
        }}
        className="flex w-max"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function HomepageClientMotion(props: HomepageClientMotionProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    if (props.type === 'marquee') {
      return <div className={`overflow-hidden w-full ${props.className}`}>{props.children}</div>
    }
    return <div className={props.className}>{props.children}</div>
  }

  if (props.type === 'hero') {
    return <HeroParallax {...props} shouldReduceMotion={Boolean(shouldReduceMotion)} />
  }

  if (props.type === 'marquee') {
    return <MarqueeStrip {...props} shouldReduceMotion={Boolean(shouldReduceMotion)} />
  }

  return <motion.div className={props.className}>{props.children}</motion.div>
}
