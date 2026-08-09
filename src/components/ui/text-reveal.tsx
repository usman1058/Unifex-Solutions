'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TextRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function TextReveal({
  children,
  delay = 0,
  className = ''
}: TextRevealProps) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
