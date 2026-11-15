'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Linkedin, MoveDown, ShieldCheck, Sparkles, Terminal } from 'lucide-react'
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

const principles = [
  ['01', 'Make it legible', 'Complex systems become useful when every decision can be understood, measured, and improved.'],
  ['02', 'Secure the edges', 'Security belongs in the architecture from the first conversation through release and maintenance.'],
  ['03', 'Stay close', 'Short feedback loops keep product decisions connected to the people who use the result.'],
]

export default function AboutExperience({ teamMembers }: { teamMembers: TeamMember[] }) {
  const reduceMotion = useReducedMotion()

  return (
    <main className="relative min-h-screen overflow-hidden bg-background pt-24 text-on-surface">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,184,123,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,184,123,0.12)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
        <motion.div className="absolute -right-48 top-28 h-[34rem] w-[34rem] rounded-full bg-primary/[0.10] blur-[110px]" animate={reduceMotion ? undefined : { x: [0, -45, 0], y: [0, 55, 0], scale: [1, 1.08, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute -left-56 top-[45rem] h-[30rem] w-[30rem] rounded-full bg-orange-400/[0.07] blur-[100px]" animate={reduceMotion ? undefined : { x: [0, 55, 0], y: [0, -40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute right-[12%] top-[28rem] hidden h-px w-72 bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" animate={reduceMotion ? undefined : { x: [-45, 45, -45], opacity: [0.25, 0.75, 0.25] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <section className="relative flex min-h-[calc(88svh-6rem)] items-center overflow-hidden border-b border-primary/15 py-16 sm:py-20 md:min-h-[82vh] md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_45%,rgba(255,184,123,0.07),transparent_38%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.025)_50%,transparent_51%)]" />
        <div className="container relative mx-auto grid items-center gap-8 px-6 sm:gap-12 md:px-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
          <motion.div initial={reduceMotion ? undefined : { opacity: 0, y: 28 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mb-8 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.45em] text-primary sm:mb-10"><span>Unifex / The studio</span><span className="hidden text-on-surface/55 sm:block">About / 01</span></div>
            <h1 data-cursor-text className="max-w-5xl font-headline text-5xl font-black uppercase leading-[0.88] tracking-[-0.08em] sm:text-6xl md:text-8xl lg:text-[7.7rem]">We build<br /><span className="text-primary/65">systems</span><br />that move.</h1>
            <p data-cursor-text className="mt-8 max-w-xl border-l border-primary/60 pl-5 text-base leading-relaxed text-on-surface/75 sm:mt-10 sm:pl-6 md:text-lg">Unifex Solutions engineers resilient digital products, secure platforms, and high-performance experiences for ambitious teams.</p>
            <Link href="#principles" className="group mt-8 inline-flex min-h-11 items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary sm:mt-10"><span>How we work</span><MoveDown className="h-4 w-4 transition-transform group-hover:translate-y-1.5" /></Link>
          </motion.div>

          <motion.div initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92, rotate: -3 }} animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto aspect-square w-full max-w-[31rem]">
            <div aria-hidden="true" className="absolute inset-[7%] rounded-full border border-primary/10" />
            <motion.div aria-hidden="true" className="absolute inset-[13%] rotate-12 border border-primary/45" animate={reduceMotion ? undefined : { rotate: [12, 24, 12], scale: [1, 1.035, 1] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div aria-hidden="true" className="absolute inset-[23%] rounded-full border border-on-surface/20" animate={reduceMotion ? undefined : { rotate: [0, 360] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
            <motion.div aria-hidden="true" className="absolute inset-[31%] rounded-full border border-dashed border-primary/35" animate={reduceMotion ? undefined : { rotate: [360, 0] }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} />
            <motion.div aria-hidden="true" className="absolute left-1/2 top-[8%] h-[84%] w-px origin-center bg-gradient-to-b from-transparent via-primary/75 to-transparent" animate={reduceMotion ? undefined : { rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
            <motion.div aria-hidden="true" className="absolute left-[8%] top-1/2 h-px w-[84%] bg-gradient-to-r from-transparent via-primary/35 to-transparent" animate={reduceMotion ? undefined : { scaleX: [0.65, 1, 0.65], opacity: [0.25, 0.7, 0.25] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
            <div className="absolute inset-[35%] flex flex-col items-center justify-center rounded-full border border-primary/35 bg-[#11110f]/90 shadow-[0_0_80px_rgba(255,184,123,0.12)] backdrop-blur-sm">
              <Sparkles aria-hidden="true" className="mb-2 h-5 w-5 text-primary" />
              <span className="font-headline text-3xl font-black uppercase tracking-[-0.06em] text-white sm:text-4xl">UF</span>
              <span className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-on-surface/65">Build with intent</span>
            </div>
            <div className="absolute left-0 top-[22%] border border-outline-variant/40 bg-[#11110f]/90 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/80 backdrop-blur-sm">01 / Strategy</div>
            <div className="absolute right-0 top-[42%] border border-outline-variant/40 bg-[#11110f]/90 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/80 backdrop-blur-sm">02 / Engineering</div>
            <div className="absolute bottom-[18%] left-[13%] border border-outline-variant/40 bg-[#11110f]/90 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/80 backdrop-blur-sm">03 / Growth</div>
          </motion.div>
        </div>
      </section>

      <section id="principles" className="relative border-b border-primary/15 bg-[#10110e]/90 py-20 backdrop-blur-sm md:py-28">
        <div className="container relative mx-auto px-6 md:px-12">
          <motion.div initial={reduceMotion ? undefined : { opacity: 0, y: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }} className="mb-12 flex items-end justify-between gap-8 sm:mb-14">
            <div><p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">The operating principles</p><h2 data-cursor-text className="font-headline text-4xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-5xl md:text-7xl">Built on<br /><span className="text-on-surface/40">intent.</span></h2></div>
            <p data-cursor-text className="hidden max-w-xs text-right text-base leading-relaxed text-on-surface/80 md:block">Clear principles help us make good decisions when the work gets complicated.</p>
          </motion.div>
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {principles.map(([number, title, copy], index) => <motion.article key={number} initial={reduceMotion ? undefined : { opacity: 0, y: 26 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={reduceMotion ? undefined : { y: -6 }} className="group relative min-h-[250px] overflow-hidden border border-white/[0.09] bg-[#171714] p-6 transition-colors hover:border-primary/55 hover:bg-[#1c1b17] sm:min-h-[275px] sm:p-8">
              <span aria-hidden="true" className="font-headline text-5xl font-black italic text-primary/55 transition-colors group-hover:text-primary">{number}</span><div aria-hidden="true" className="absolute right-7 top-7 h-2.5 w-2.5 rounded-full bg-primary/75 shadow-[0_0_18px_rgba(255,184,123,0.55)]" />
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8"><h3 data-cursor-text className="mb-3 font-headline text-2xl font-black uppercase tracking-[-0.04em] text-white sm:text-3xl">{title}</h3><p data-cursor-text className="text-base leading-relaxed text-on-surface/80 transition-colors group-hover:text-on-surface/90">{copy}</p></div>
            </motion.article>)}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_70%_45%,rgba(255,184,123,0.06),transparent_60%)]" />
        <div className="container relative mx-auto grid gap-10 px-6 md:px-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div><p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">The collective</p><h2 data-cursor-text className="font-headline text-4xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-5xl md:text-7xl">People<br /><span className="text-on-surface/40">behind</span><br />the signal.</h2><p data-cursor-text className="mt-7 max-w-sm text-base leading-relaxed text-on-surface/80">A focused team brings product thinking, engineering, and security into the same conversation.</p><div className="mt-7 flex items-center gap-3 text-sm text-on-surface/75"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />Careful work, shared openly</div></div>
          <div>{teamMembers.length > 0 ? <div className="grid gap-4 sm:grid-cols-2">{teamMembers.map((member, index) => <motion.article key={member.id} initial={reduceMotion ? undefined : { opacity: 0, y: 22 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: index * 0.08 }} className="group border border-outline-variant/25 bg-surface/90 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/55 sm:p-5"><div className="relative mb-5 aspect-[4/3] overflow-hidden bg-[#171714]">{member.imageUrl ? <img src={member.imageUrl} alt={member.name} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" /> : <div className="flex h-full items-center justify-center"><Terminal aria-hidden="true" className="h-10 w-10 text-primary/50" /></div>}<span className="absolute left-4 top-4 text-[9px] font-black uppercase tracking-[0.25em] text-white">0{index + 1} / team</span>{member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`} className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/75 text-white transition-colors hover:bg-primary hover:text-black"><Linkedin aria-hidden="true" className="h-4 w-4" /></a>}</div><p className="mb-2 text-[9px] font-black uppercase tracking-[0.28em] text-primary">{member.role}</p><h3 data-cursor-text className="font-headline text-2xl font-black uppercase tracking-tight group-hover:text-primary">{member.name}</h3>{member.bio && <p data-cursor-text className="mt-3 text-base leading-relaxed text-on-surface/80">{member.bio}</p>}</motion.article>)}</div> : <motion.div initial={reduceMotion ? undefined : { opacity: 0, x: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} className="relative min-h-[250px] overflow-hidden border border-outline-variant/25 bg-[#11110f] p-7 sm:p-10"><div aria-hidden="true" className="absolute inset-y-0 right-10 hidden w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent sm:block" /><p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">A team built around the work</p><p data-cursor-text className="mt-7 max-w-lg font-headline text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">Thoughtful collaboration. <span className="text-on-surface/50">Clear ownership.</span> Work that moves forward.</p><p data-cursor-text className="mt-5 max-w-lg text-base leading-relaxed text-on-surface/80">We keep the focus on the people and expertise needed for each engagement. Get in touch to meet the team for your project.</p><Link href="/contact" className="mt-7 inline-flex min-h-11 items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-primary hover:text-white">Talk with us <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></motion.div>}</div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-primary/20 bg-primary px-6 py-20 text-center sm:py-24 md:py-32">
        <motion.div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full border border-black/15" animate={reduceMotion ? undefined : { rotate: [0, 360], scale: [1, 1.08, 1] }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} />
        <Sparkles aria-hidden="true" className="mx-auto mb-6 h-7 w-7 text-black/70" /><h2 data-cursor-text className="mx-auto max-w-5xl font-headline text-4xl font-black uppercase leading-[0.92] tracking-[-0.07em] text-black sm:text-5xl md:text-8xl">Build your<br />next system.</h2><p data-cursor-text className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-black/75 sm:text-base">Tell us what you are working toward. We will help you shape the right next step.</p><Link href="/contact" className="group mx-auto mt-9 inline-flex min-h-12 items-center gap-4 bg-black px-7 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-white hover:text-black sm:mt-12 sm:px-8">Start a conversation <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
      </section>
    </main>
  )
}
