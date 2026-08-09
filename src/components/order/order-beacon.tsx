'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check, FileText, LockKeyhole, Sparkles } from 'lucide-react'

export default function OrderBeacon() {
  const reduceMotion = useReducedMotion()
  return <div className="relative mx-auto h-64 w-full max-w-sm [perspective:1000px] md:h-80"><motion.div className="absolute left-1/2 top-1/2 h-40 w-56 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]" animate={reduceMotion ? undefined : { rotateY: [0, 12, 0], rotateX: [0, -5, 0], y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}><div className="absolute inset-0 border border-primary/60 bg-primary/10 shadow-[0_0_60px_rgba(213,255,0,0.15)] [transform:translateZ(30px)]" /><div className="absolute inset-0 border border-primary/30 bg-primary/[0.04] [transform:rotateY(90deg)_translateZ(30px)]" /><div className="absolute inset-0 flex items-center justify-center gap-3 [transform:translateZ(32px)]"><FileText className="h-8 w-8 text-primary" /><LockKeyhole className="h-6 w-6 text-primary/60" /></div></motion.div><motion.div className="absolute inset-8 rounded-full border border-primary/35" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} /><div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 translate-y-24 items-center gap-2 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.3em] text-on-surface/35"><Check className="h-3.5 w-3.5 text-primary" /> Brief / review / activate</div><Sparkles className="absolute right-5 top-5 h-5 w-5 text-primary" /></div>
}
