'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Quote, Star } from 'lucide-react'
import Link from 'next/link'

type Testimonial = {
  name: string
  role?: string | null
  company?: string | null
  content: string
}

export default function TestimonialSpotlight({ testimonial }: { testimonial: Testimonial }) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#151515] p-7 sm:p-12 lg:p-16"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-primary/20" />
        <motion.div
          className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-primary/20"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
          <div>
            <div className="mb-8 flex items-center gap-3 text-primary">
              <Quote className="h-8 w-8 fill-primary/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em]">Client signal</span>
            </div>
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Verified experience</p>
          </div>
          <div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="font-headline text-2xl font-light italic leading-relaxed text-on-surface sm:text-4xl"
            >
              "{testimonial.content}"
            </motion.p>
            <div className="mt-10 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-end">
              <div>
                <h3 className="font-headline text-lg font-black uppercase text-primary">{testimonial.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-on-surface-variant">{testimonial.role}, {testimonial.company}</p>
              </div>
              <Link href="/contact" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Build your signal
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
