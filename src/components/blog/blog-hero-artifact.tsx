'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { BookOpen, Code2, ShieldCheck, Sparkles } from 'lucide-react'

export default function BlogHeroArtifact() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div initial={reduceMotion ? undefined : { opacity: 0, scale: 0.82 }} animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative mx-auto h-64 w-full max-w-sm [perspective:1000px] md:h-80">
      <motion.div className="absolute left-1/2 top-1/2 h-32 w-52 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]" animate={reduceMotion ? undefined : { rotateY: [0, 8, 0], rotateX: [0, -4, 0], y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute inset-y-0 left-0 w-1/2 origin-right -skew-y-6 border border-primary/70 bg-primary/10 shadow-[0_0_50px_rgba(213,255,0,0.15)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 origin-left skew-y-6 border border-primary/50 bg-primary/[0.06]" />
        <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_35px_rgba(213,255,0,0.45)]"><BookOpen className="h-7 w-7" /></div>
        <div className="absolute left-7 top-8 h-px w-14 bg-primary/60" /><div className="absolute right-7 top-8 h-px w-14 bg-primary/40" /><div className="absolute bottom-8 left-10 h-px w-10 bg-primary/40" /><div className="absolute bottom-8 right-10 h-px w-10 bg-primary/60" />
      </motion.div>
      <motion.div className="absolute inset-7 rounded-full border border-primary/35" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="absolute inset-0 rounded-full border border-white/10" animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" animate={reduceMotion ? undefined : { x: ['-20%', '20%', '-20%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.3em] text-on-surface/35"><Code2 className="h-3.5 w-3.5 text-primary" /> Ideas that ship <ShieldCheck className="h-3.5 w-3.5 text-primary" /></div>
      <Sparkles className="absolute right-4 top-5 h-5 w-5 text-primary" />
    </motion.div>
  )
}
