'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ServiceVisualProps {
  title: string
  imageUrl?: string | null
  index?: number
  compact?: boolean
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
]

export default function ServiceVisual({ title, imageUrl, index = 0, compact = false }: ServiceVisualProps) {
  const reduceMotion = useReducedMotion()
  const image = imageUrl || fallbackImages[index % fallbackImages.length]

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92, rotateX: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? undefined : { rotateX: -3, rotateY: 4, scale: 1.02 }}
      className={`group/visual relative overflow-hidden border border-primary/25 bg-[#111] [perspective:1100px] ${compact ? 'h-48 md:h-64' : 'h-72 md:h-[28rem]'}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.img
        src={image}
        alt={`${title} visual preview`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-65 grayscale transition-all duration-700 group-hover/visual:scale-110 group-hover/visual:opacity-90 group-hover/visual:grayscale-0"
        animate={reduceMotion ? undefined : { scale: [1, 1.04, 1], x: ['0%', '1.5%', '0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.15),rgba(0,0,0,0.82)),linear-gradient(0deg,rgba(213,255,0,0.15),transparent_48%)]" />
      <motion.div
        className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-primary/45"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border border-white/20"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute right-12 top-1/2 h-16 w-16 -translate-y-1/2 [transform-style:preserve-3d]"
        animate={reduceMotion ? undefined : { rotateX: [0, 360], rotateY: [0, 180], y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="absolute inset-0 border border-primary/80 bg-primary/20 [transform:translateZ(32px)]" />
        <span className="absolute inset-0 border border-primary/50 bg-primary/10 [transform:rotateY(90deg)_translateZ(32px)]" />
        <span className="absolute inset-0 border border-primary/35 bg-primary/5 [transform:rotateX(90deg)_translateZ(32px)]" />
      </motion.div>
      <div className="absolute left-6 top-6 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.35em] text-primary">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Live capability
      </div>
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
        <div>
          <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.3em] text-white/50">System view / 0{index + 1}</span>
          <span className="font-headline text-xl font-black uppercase tracking-tight text-white md:text-3xl">{title}</span>
        </div>
        <motion.div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary text-primary"
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-lg">✦</span>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/visual:opacity-100">
        <div className="absolute left-0 top-1/3 h-px w-full bg-primary/70 shadow-[0_0_16px_rgba(213,255,0,0.9)]" />
        <div className="absolute left-1/3 top-0 h-full w-px bg-primary/35" />
      </div>
    </motion.div>
  )
}
