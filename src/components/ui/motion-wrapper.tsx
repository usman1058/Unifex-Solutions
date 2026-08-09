'use client'

import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  viewportMargin?: string
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  viewportMargin = '-50px',
}: FadeInProps) {
  const getVariants = () => {
    switch (direction) {
      case 'up':
        return { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }
      case 'down':
        return { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } }
      case 'left':
        return { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } }
      case 'right':
        return { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } }
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 } }
    }
  }

  const variants = getVariants()

  return (
    <motion.div
      initial={variants.initial}
      whileInView={variants.animate}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  staggerChildren = 0.1,
  className = '',
}: {
  children: ReactNode
  staggerChildren?: number
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function KineticBorder({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group overflow-hidden border border-outline-variant/15 hover:border-primary/50 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedCounterProps {
  value: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 1.2, className = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value)
      return
    }
    if (!isInView) return

    const numericMatch = value.match(/\d+/)
    if (!numericMatch) {
      setDisplayValue(value)
      return
    }

    const targetNumber = parseInt(numericMatch[0], 10)
    const suffix = value.replace(/\d+/g, '')

    const controls = animate(0, targetNumber, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        setDisplayValue(`${Math.round(latest)}${suffix}`)
      },
    })

    return () => controls.stop()
  }, [isInView, value, duration, shouldReduceMotion])

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  )
}
