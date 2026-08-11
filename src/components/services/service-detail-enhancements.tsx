'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Layers, MoveRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface ServiceDetailEnhancementsProps {
  process: string[]
  techStack: string[]
  faqs: Array<{ question?: string; answer?: string }>
  featureCount: number
  serviceTitle: string
}

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

export default function ServiceDetailEnhancements({ process, techStack, faqs, featureCount, serviceTitle }: ServiceDetailEnhancementsProps) {
  const reduceMotion = useReducedMotion()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <section className="relative overflow-hidden border-y border-primary/15 bg-[#0d0e0b] py-20 md:py-28">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="container relative mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal} transition={{ duration: 0.7 }} className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary"><MoveRight className="h-4 w-4" /> The delivery path</p>
              <h2 className="font-headline text-5xl font-black uppercase tracking-[-0.07em] text-white md:text-7xl">How it moves.</h2>
            </div>
            <span className="hidden text-[9px] font-black uppercase tracking-[0.3em] text-white/30 md:block">{serviceTitle} / protocol</span>
          </motion.div>

          {process.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {process.map((step, index) => (
                <motion.div key={`${step}-${index}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal} transition={{ duration: 0.65, delay: index * 0.1 }} whileHover={reduceMotion ? undefined : { y: -8 }} className="group relative min-h-[240px] overflow-hidden border border-white/[0.08] bg-[#151713] p-7 transition-colors duration-500 hover:border-primary/60 hover:bg-[#1b1e15]">
                  <motion.div className="absolute left-0 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100" animate={reduceMotion ? undefined : { x: ['-100%', '220%'] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: index * 0.2 }} />
                  <div className="mb-12 flex items-start justify-between"><span className="font-headline text-5xl font-black italic tracking-[-0.08em] text-primary/30 transition-colors group-hover:text-primary">0{index + 1}</span><span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(213,255,0,0.8)] transition-transform group-hover:scale-150" /></div>
                  <p className="text-sm font-medium leading-relaxed text-white/65 transition-colors group-hover:text-white">{typeof step === 'string' ? step : JSON.stringify(step)}</p>
                  <span className="absolute bottom-5 right-6 text-[9px] font-black uppercase tracking-[0.25em] text-white/20">Phase {index + 1}</span>
                </motion.div>
              ))}
            </div>
          ) : <div className="border border-dashed border-primary/25 bg-primary/[0.03] p-10 text-sm text-white/45">The delivery path is shaped around your brief.</div>}
        </div>
      </section>

      <section className="relative border-b border-primary/15 bg-[#11120f] py-16 md:py-20">
        <div className="container mx-auto grid gap-4 px-6 md:grid-cols-4 md:px-12">
          {[
            [String(featureCount).padStart(2, '0'), 'Core deliverables', 'Mapped to the selected capability'],
            [String(techStack.length).padStart(2, '0'), 'System layers', 'Tools selected for the outcome'],
            ['01–02', 'Review window', 'Business days to validate fit'],
            ['100%', 'Human review', 'No brief disappears into a void'],
          ].map(([value, label, detail], index) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08 }} className="group border-l border-primary/25 px-6 py-3 first:border-l-0 md:first:border-l">
              <motion.span initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 + 0.2 }} className="block font-headline text-4xl font-black tracking-tight text-primary md:text-5xl">{value}</motion.span>
              <span className="mt-3 block text-[10px] font-black uppercase tracking-[0.25em] text-white/75">{label}</span>
              <span className="mt-2 block text-xs leading-relaxed text-white/35">{detail}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-primary/15 bg-[#0b0c0a] py-20 md:py-28">
        <div className="container relative mx-auto grid gap-12 px-6 md:px-12 lg:grid-cols-[0.75fr_1.25fr]">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.7 }}>
            <p className="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary"><Layers3 className="h-4 w-4" /> Structural stack</p>
            <h2 className="font-headline text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] text-white md:text-7xl">The parts<br /><span className="text-white/25">underneath.</span></h2>
            <p className="mt-7 max-w-sm text-sm leading-relaxed text-white/45">A considered toolkit gives the work a longer life. These are the layers we reach for when this capability goes into production.</p>
          </motion.div>
          <div className="grid gap-3 sm:grid-cols-2">
            {techStack.length > 0 ? techStack.map((tech, index) => (
              <motion.div key={tech} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55, delay: index * 0.08 }} whileHover={reduceMotion ? undefined : { x: 8 }} className="group relative overflow-hidden border border-white/[0.08] bg-[#151713] p-6 transition-all duration-500 hover:border-primary/60 hover:bg-primary hover:text-black">
                <div className="mb-10 flex items-center justify-between"><span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary group-hover:text-black/60">Layer 0{index + 1}</span><Sparkles className="h-4 w-4 text-white/20 transition-colors group-hover:text-black/60" /></div>
                <span className="font-headline text-2xl font-black uppercase tracking-tight">{tech}</span>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full group-hover:bg-black/60" />
              </motion.div>
            )) : <div className="border border-dashed border-primary/25 bg-primary/[0.03] p-8 text-sm text-white/45">The stack is tailored during discovery.</div>}
          </div>
        </div>
      </section>

      {faqs.length > 0 && <section className="bg-[#10110e] py-20 md:py-28"><div className="container mx-auto max-w-5xl px-6 md:px-12"><motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} transition={{ duration: 0.7 }} className="mb-12"><p className="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary"><ShieldCheck className="h-4 w-4" /> Before we begin</p><h2 className="font-headline text-5xl font-black uppercase tracking-[-0.07em] text-white md:text-7xl">Good questions.</h2></motion.div><div className="space-y-3">{faqs.map((faq, index) => { const isOpen = openFaq === index; return <motion.div key={index} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }} className={`overflow-hidden border bg-[#151713] transition-colors duration-500 ${isOpen ? 'border-primary/60' : 'border-white/[0.08] hover:border-primary/30'}`}><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 p-6 text-left md:p-8"><span className="flex items-center gap-5 font-headline text-lg font-black uppercase tracking-tight text-white md:text-2xl"><span className="text-sm text-primary/60">0{index + 1}</span>{faq.question || 'What should I know?'}</span><ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} /></button><AnimatePresence initial={false}>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}><p className="border-t border-primary/15 px-6 pb-7 pt-5 text-sm leading-relaxed text-white/50 md:px-8 md:pb-8">{faq.answer || ''}</p></motion.div>}</AnimatePresence></motion.div> })}</div></div></section>}

    </>
  )
}
