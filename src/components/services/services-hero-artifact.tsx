'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Code2, Palette, ShieldCheck, TrendingUp } from 'lucide-react'

export default function ServicesHeroArtifact() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, scale: 0.82, rotate: -8 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto h-64 w-full max-w-sm [perspective:1000px] md:h-80"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
        animate={reduceMotion ? undefined : { rotateX: [0, 360], rotateY: [0, 360], y: [0, -14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute inset-0 border border-primary bg-primary/15 shadow-[0_0_55px_rgba(213,255,0,0.22)] [transform:translateZ(72px)]" />
        <span className="absolute inset-0 border border-primary/70 bg-primary/10 [transform:rotateY(90deg)_translateZ(72px)]" />
        <span className="absolute inset-0 border border-primary/50 bg-primary/5 [transform:rotateX(90deg)_translateZ(72px)]" />
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 font-headline text-center text-primary [transform:translateZ(74px)]"><strong className="text-3xl font-black">UF</strong><small className="text-[8px] font-black uppercase tracking-[0.25em] text-black">Service core</small></span>
      </motion.div>
      <motion.div className="absolute inset-8 rounded-full border border-primary/35" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="absolute inset-0 rounded-full border border-white/10" animate={reduceMotion ? undefined : { rotate: -360, scale: [1, 1.08, 1] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" animate={reduceMotion ? undefined : { x: ['-18%', '18%', '-18%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      {[['top-0 left-1/2 -translate-x-1/2', 'Design', Palette], ['right-0 top-1/2 -translate-y-1/2', 'Build', Code2], ['bottom-0 left-1/2 -translate-x-1/2', 'Protect', ShieldCheck], ['left-0 top-1/2 -translate-y-1/2', 'Grow', TrendingUp]].map(([position, label, Icon], index) => {
        const ServiceIcon = Icon as typeof Code2
        return <motion.div key={label as string} className={`absolute ${position} flex items-center gap-2 border border-primary/25 bg-[#151713] px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-primary shadow-[0_0_20px_rgba(213,255,0,0.08)]`} animate={reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -5 : 5, 0] }} transition={{ duration: 3 + index, repeat: Infinity, ease: 'easeInOut' }}><ServiceIcon className="h-3.5 w-3.5" />{label as string}</motion.div>
      })}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.35em] text-on-surface/35">Systems / signals / outcomes</div>
    </motion.div>
  )
}
