'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Linkedin, MoveDown, MoveRight, ShieldCheck, Sparkles, Terminal } from 'lucide-react'
import Link from 'next/link'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  imageUrl: string | null
  linkedinUrl: string | null
  githubUrl: string | null
}

export default function AboutExperience({ teamMembers }: { teamMembers: TeamMember[] }) {
  const reduceMotion = useReducedMotion()
  const values = [
    ['01', 'Make it legible', 'Complex systems become useful when every decision can be understood, measured, and improved.'],
    ['02', 'Secure the edges', 'Security is a design material. We build trust into the architecture before launch day.'],
    ['03', 'Stay close', 'Small, senior teams create sharper feedback loops and better work for the people using it.'],
  ]

  return (
    <main className="min-h-screen overflow-hidden bg-background pt-24 text-on-surface">
      <section className="relative min-h-[82vh] border-b border-primary/15 py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_38%,rgba(213,255,0,0.15),transparent_25%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.025)_50%,transparent_51%)]" />
        <div className="container relative mx-auto grid items-center gap-16 px-6 md:px-12 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={reduceMotion ? undefined : { opacity: 0, y: 34 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="mb-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.45em] text-primary"><span>Unifex / The studio</span><span className="hidden text-on-surface/30 md:block">About / 01</span></div>
            <h1 className="max-w-5xl font-headline text-6xl font-black uppercase leading-[0.8] tracking-[-0.09em] md:text-[9.7rem]">We make<br /><span className="text-on-surface/25">complex</span><br />feel clear.</h1>
            <p className="mt-12 max-w-xl border-l border-primary/60 pl-6 text-base leading-relaxed text-on-surface/65 md:text-lg">Unifex is a software development and cyber security studio for ambitious teams who need their digital infrastructure to move with them.</p>
            <Link href="#principles" className="group mt-12 inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.35em] text-primary">Scroll into the studio <MoveDown className="h-4 w-4 transition-transform group-hover:translate-y-2" /></Link>
          </motion.div>
          <motion.div initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8, rotate: -8 }} animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.2, delay: 0.2 }} className="relative mx-auto aspect-square w-full max-w-[32rem] [perspective:1000px]">
            <motion.div className="absolute inset-[13%] rotate-12 border border-primary/50" animate={reduceMotion ? undefined : { rotate: [12, 24, 12], scale: [1, 1.05, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute inset-[24%] -rotate-45 rounded-full border border-on-surface/20" animate={reduceMotion ? undefined : { rotate: [-45, 315] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} />
            <div className="absolute inset-[32%] rounded-full bg-primary shadow-[0_0_100px_rgba(213,255,0,0.28)]" />
            <motion.div className="absolute left-1/2 top-0 h-full w-px origin-center bg-gradient-to-b from-transparent via-primary to-transparent" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[9px] font-black uppercase tracking-[0.35em] text-on-surface/45">Strategy / design / build / protect</div>
          </motion.div>
        </div>
      </section>

      <section id="principles" className="border-b border-primary/15 bg-[#10110e] py-20 md:py-28"><div className="container mx-auto px-6 md:px-12"><div className="mb-14 flex items-end justify-between gap-8"><div><p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">The operating system</p><h2 className="font-headline text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] md:text-7xl">Built on<br /><span className="text-white/25">intent.</span></h2></div><span className="hidden max-w-xs text-right text-xs leading-relaxed text-white/35 md:block">A few principles keep the work honest when the surface gets complicated.</span></div><div className="grid gap-4 md:grid-cols-3">{values.map(([number, title, copy], index) => <motion.article key={number} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.1 }} whileHover={reduceMotion ? undefined : { y: -8 }} className="group relative min-h-[300px] overflow-hidden border border-white/[0.08] bg-[#171914] p-7 transition-colors hover:border-primary/60 hover:bg-[#1d2116]"><span className="font-headline text-6xl font-black italic text-primary/25 transition-colors group-hover:text-primary">{number}</span><div className="absolute right-7 top-7 h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_rgba(213,255,0,0.75)]" /><div className="absolute bottom-7 left-7 right-7"><h3 className="mb-4 font-headline text-3xl font-black uppercase tracking-[-0.04em] text-white">{title}</h3><p className="text-sm leading-relaxed text-white/45 transition-colors group-hover:text-white/70">{copy}</p></div></motion.article>)}</div></div></section>

      <section className="relative py-20 md:py-28"><div className="container mx-auto grid gap-14 px-6 md:px-12 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">The collective</p><h2 className="font-headline text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] md:text-7xl">People<br /><span className="text-on-surface/25">behind</span><br />the signal.</h2><div className="mt-10 flex items-center gap-3 text-xs text-on-surface/45"><ShieldCheck className="h-4 w-4 text-primary" /> Senior thinking, close collaboration</div></div><div>{teamMembers.length > 0 ? <div className="grid gap-4 sm:grid-cols-2">{teamMembers.map((member, index) => <motion.article key={member.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }} className="group border border-outline-variant/15 bg-surface p-5 transition-all duration-500 hover:-translate-y-2 hover:border-primary/60"><div className="relative mb-6 aspect-[4/5] overflow-hidden bg-[#171914]">{member.imageUrl ? <img src={member.imageUrl} alt={member.name} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" /> : <div className="flex h-full items-center justify-center"><Terminal className="h-10 w-10 text-primary/30" /></div>}<span className="absolute left-4 top-4 text-[9px] font-black uppercase tracking-[0.3em] text-primary">0{index + 1} / crew</span><div className="absolute bottom-4 right-4 flex gap-2">{member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-primary hover:text-black"><Linkedin className="h-4 w-4" /></a>}</div></div><p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary">{member.role}</p><h3 className="font-headline text-2xl font-black uppercase tracking-tight group-hover:text-primary">{member.name}</h3>{member.bio && <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-on-surface/50">{member.bio}</p>}</motion.article>)}</div> : <div className="border border-dashed border-primary/25 p-12 text-sm text-on-surface/45">The studio roster is being updated.</div>}</div></div></section>

      <section className="border-t border-primary/15 bg-primary py-24 md:py-36"><div className="container mx-auto px-6 text-center md:px-12"><Sparkles className="mx-auto mb-8 h-8 w-8 text-black" /><h2 className="mx-auto mb-10 max-w-5xl font-headline text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-black md:text-8xl">Bring us the<br /><span className="text-black/35">hard part.</span></h2><Link href="/order" className="group inline-flex items-center gap-4 bg-black px-8 py-5 text-[10px] font-black uppercase tracking-[0.35em] text-white transition-colors hover:bg-white hover:text-black">Start a conversation <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div></section>
    </main>
  )
}
