'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Shuffle from '@/components/ui/shuffle'

const headings = [
  ['ARCHITECTING', 'DIGITAL', 'EXCELLENCE'],
  ['ENGINEERING', 'TOMORROW', 'TODAY'],
  ['BUILDING', 'SCALABLE', 'SOLUTIONS'],
  ['ELEVATING', 'DIGITAL', 'EXPERIENCES'],
]

export default function HeroContent() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % headings.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-4 text-left">
          <span className="flex h-9 w-9 items-center justify-center border border-primary/45 bg-primary/5 font-headline text-[11px] font-black tracking-[-0.08em] text-primary shadow-[0_0_24px_rgba(255,164,76,0.12)]">UF</span>
          <span className="h-px w-12 bg-gradient-to-r from-primary to-primary/10" />
          <span className="flex flex-col gap-1 text-left text-[9px] font-label font-bold uppercase tracking-[0.28em] text-on-surface-variant">
            <span className="text-primary">Unifex / digital systems studio</span>
            <span className="text-[8px] tracking-[0.38em] text-on-surface-variant/45">Products · platforms · progress</span>
          </span>
        </div>
      </motion.div>

      <div className="mt-6" key={index}>
        {headings[index].map((line, i) => (
          <Shuffle
            key={i}
            text={line}
            tag="span"
            className="block font-headline font-black text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] xl:text-[5.8rem] leading-[0.98] tracking-tight uppercase text-on-surface"
            shuffleDirection="right"
            duration={0.4}
            animationMode="evenodd"
            shuffleTimes={2}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
            colorFrom="#F97316"
            colorTo="inherit"
          />
        ))}
      </div>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 pt-6 pb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-black font-label font-black text-xs tracking-widest uppercase hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/20 active:scale-95 rounded-sm"
        >
          START A PROJECT
          <ArrowUpRight className="w-4 h-4" />
        </Link>

        <a
          href="#capabilities"
          className="inline-flex items-center gap-2 text-xs font-label tracking-[0.2em] uppercase text-on-surface-variant hover:text-primary transition-colors py-2 group"
        >
          EXPLORE CAPABILITIES
          <div className="h-px w-8 bg-primary/40 group-hover:w-12 transition-all" />
        </a>
      </motion.div>
    </div>
  )
}
