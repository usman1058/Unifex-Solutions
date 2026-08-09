'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Services', href: '/services', number: '01' },
  { label: 'Work', href: '/portfolio', number: '02' },
  { label: 'Journal', href: '/blog', number: '03' },
  { label: 'Studio', href: '/about', number: '04' },
]

export default function Navbar() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return <>
    <motion.header initial={reduceMotion ? undefined : { y: -24, opacity: 0 }} animate={reduceMotion ? undefined : { y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className={`fixed left-0 right-0 top-0 z-50 px-4 pt-4 transition-all duration-500 md:px-8 ${scrolled ? 'pt-3' : 'pt-5'}`}>
      <div className={`mx-auto flex max-w-[1440px] items-center justify-between rounded-full border px-3 py-3 transition-all duration-500 md:px-4 ${scrolled ? 'border-primary/30 bg-[#11120f]/90 shadow-[0_12px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl' : 'border-white/[0.12] bg-black/25 backdrop-blur-xl'}`}>
        <Link href="/" className="group flex items-center gap-3 rounded-full px-2 py-1" aria-label="Unifex Solutions home"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-[#11120f] transition-transform duration-500 group-hover:rotate-6"><img src="/logo.webp" alt="" className="h-full w-full object-cover" /></span><span className="hidden font-headline text-lg font-black uppercase tracking-[-0.05em] text-white sm:block">UNIFEX<span className="text-primary">.</span></span></Link>
        <motion.nav initial={reduceMotion ? undefined : { opacity: 0 }} animate={reduceMotion ? undefined : { opacity: 1 }} transition={{ delay: 0.35, duration: 0.5 }} className="hidden items-center gap-1 md:flex">{links.map((link, index) => <motion.div key={link.href} initial={reduceMotion ? undefined : { y: -8, opacity: 0 }} animate={reduceMotion ? undefined : { y: 0, opacity: 1 }} transition={{ delay: 0.4 + index * 0.08, duration: 0.45 }}><Link href={link.href} className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5 ${active(link.href) ? 'text-primary' : 'text-white/55 hover:text-white'}`}><span className="text-[8px] text-primary/50 transition-transform duration-300 group-hover:-translate-y-0.5">{link.number}</span>{link.label}<span className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-primary transition-all duration-300 ${active(link.href) ? 'w-1/2' : 'w-0 group-hover:w-1/2'}`} /></Link></motion.div>)}</motion.nav>
        <div className="flex items-center gap-2"><Link href="/order" className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-black transition-colors hover:bg-white sm:px-5">Start a project <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" /></Link><button type="button" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.15] text-white transition-colors hover:border-primary hover:text-primary md:hidden"><Menu className="h-5 w-5" /></button></div>
      </div>
    </motion.header>

    <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0b0c0a]/95 p-4 backdrop-blur-2xl md:p-8"><motion.div initial={reduceMotion ? undefined : { y: -30, opacity: 0 }} animate={reduceMotion ? undefined : { y: 0, opacity: 1 }} exit={reduceMotion ? undefined : { y: -20, opacity: 0 }} className="flex h-full flex-col rounded-[2rem] border border-primary/25 bg-[#151713] p-6 md:p-10"><div className="flex items-center justify-between"><Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-[#11120f]"><img src="/logo.webp" alt="" className="h-full w-full object-cover" /></span><span className="font-headline text-xl font-black uppercase text-white">UNIFEX<span className="text-primary">.</span></span></Link><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white hover:border-primary hover:text-primary"><X className="h-5 w-5" /></button></div><div className="my-auto flex flex-col">{links.map((link, index) => <motion.div key={link.href} initial={reduceMotion ? undefined : { x: -24, opacity: 0 }} animate={reduceMotion ? undefined : { x: 0, opacity: 1 }} transition={{ delay: index * 0.07 }}><Link href={link.href} onClick={() => setOpen(false)} className={`group flex items-end justify-between border-b border-white/[0.08] py-5 font-headline text-5xl font-black uppercase tracking-[-0.07em] transition-colors sm:text-7xl ${active(link.href) ? 'text-primary' : 'text-white hover:text-primary'}`}><span><small className="mr-4 align-top font-sans text-[10px] tracking-[0.3em] text-primary/60">{link.number}</small>{link.label}</span><ArrowUpRight className="h-8 w-8 opacity-30 transition-all group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:opacity-100" /></Link></motion.div>)}</div><div className="flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between"><span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/35">Build / protect / grow</span><Link href="/order" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-black hover:bg-white">Open an engagement <ArrowUpRight className="h-4 w-4" /></Link></div></motion.div></motion.div>}</AnimatePresence>
  </>
}
