'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function HomeIntroLoader() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('unifex-home-intro-seen')) {
      setVisible(false)
      return
    }
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('unifex-home-intro-seen', '1')
      setExiting(true)
      window.setTimeout(() => setVisible(false), 360)
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return <motion.div initial={{ opacity: 1 }} animate={{ opacity: exiting ? 0 : 1 }} transition={{ duration: 0.35 }} className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#0b0c0a] text-white"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18),transparent_30%)]" /><motion.div initial={reduceMotion ? undefined : { scale: 0.75, rotate: -15 }} animate={reduceMotion ? undefined : { scale: 1, rotate: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="relative h-52 w-52 md:h-72 md:w-72"><motion.div className="absolute inset-0 rounded-full border border-orange-400/45" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} /><motion.div className="absolute inset-6 rounded-full border border-orange-300/20" animate={reduceMotion ? undefined : { rotate: -360, scale: [1, 0.88, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} /><motion.div className="absolute inset-10 rotate-45 border border-orange-400/70 bg-orange-400/5" animate={reduceMotion ? undefined : { rotate: [45, 135, 45], scale: [1, 0.82, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} /><div className="absolute inset-16 overflow-hidden rounded-2xl border border-orange-300/60 bg-[#11120f] shadow-[0_0_55px_rgba(249,115,22,0.4)]"><img src="/logo.webp" alt="Unifex Solutions" className="h-full w-full object-cover" /></div><div className="absolute inset-0 flex items-center justify-center"><motion.div className="absolute left-1/2 top-0 h-full w-px origin-center bg-gradient-to-b from-transparent via-orange-300 to-transparent" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} /></div></motion.div><div className="absolute bottom-10 left-6 right-6 md:bottom-14 md:left-12 md:right-12"><div className="mb-3 flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/50"><span>Unifex / Digital systems</span><span>01 / 01</span></div><div className="h-px overflow-hidden bg-white/10"><motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.55, ease: 'easeInOut' }} className="h-full bg-gradient-to-r from-orange-500 via-yellow-300 to-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.9)]" /></div></div></motion.div>
}
