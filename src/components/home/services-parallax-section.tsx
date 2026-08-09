'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  ArrowUp,
  Check,
  MoveUpRight,
  Orbit,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

type ServiceItem = {
  id: string
  slug: string
  title: string
  description: string
  features: string[]
}

type ServicesParallaxSectionProps = {
  services: ServiceItem[]
}

const palettes = [
  'from-[#ffb87b] via-[#dd7d4d] to-[#6c2f2e]',
  'from-[#9de7c5] via-[#427f79] to-[#1b3036]',
  'from-[#f3d18a] via-[#b86b4c] to-[#4a2735]',
  'from-[#b8b2ff] via-[#7163ae] to-[#25243f]',
  'from-[#f5aaa1] via-[#b75b65] to-[#351f35]',
]

function ServiceIndexRow({
  service,
  index,
  active,
  onSelect,
}: {
  service: ServiceItem
  index: number
  active: boolean
  onSelect: () => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      whileHover={reduceMotion ? undefined : { x: 8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-pressed={active}
      className={[
        'group relative grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 overflow-hidden border-t border-white/10 py-5 text-left transition-colors sm:grid-cols-[4rem_1fr_auto]',
        active ? 'text-primary' : 'text-on-surface hover:text-primary',
      ].join(' ')}
    >
      <span className="font-label text-xs font-bold tracking-[0.25em] text-primary/60">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="font-headline text-2xl font-bold uppercase tracking-[-0.04em] sm:text-3xl">
        {service.title}
      </span>
      <span
        className={[
          'flex h-9 w-9 items-center justify-center rounded-full border transition-all',
          active
            ? 'rotate-45 border-primary bg-primary text-black'
            : 'border-white/15 text-white/50 group-hover:border-primary group-hover:text-primary',
        ].join(' ')}
      >
        <MoveUpRight className="h-4 w-4" />
      </span>
    </motion.button>
  )
}

function ServiceSignal({ index, reduceMotion }: { index: number; reduceMotion: boolean | null }) {
  return (
    <div className="relative aspect-square w-full max-w-[25rem] overflow-hidden rounded-full border border-white/15 bg-black/20">
      <div className="absolute inset-[8%] rounded-full border border-white/10" />
      <div className="absolute inset-[19%] rounded-full border border-white/10" />
      <div className="absolute inset-[34%] rounded-full border border-primary/40" />
      <motion.div
        className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom bg-gradient-to-t from-primary via-primary/60 to-transparent"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 16 + index * 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[39%] rounded-full bg-primary shadow-[0_0_60px_rgba(255,184,123,0.8)]"
        animate={reduceMotion ? undefined : { scale: [1, 1.18, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Orbit className="h-7 w-7 text-primary" strokeWidth={1.2} />
      </div>
      <span className="absolute left-[14%] top-[22%] text-[9px] font-black uppercase tracking-[0.35em] text-white/45">
        signal
      </span>
      <span className="absolute bottom-[20%] right-[12%] text-[9px] font-black uppercase tracking-[0.35em] text-white/45">
        {String(index + 1).padStart(2, '0')} / 0{index + 2}
      </span>
    </div>
  )
}

export default function ServicesParallaxSection({ services }: ServicesParallaxSectionProps) {
  const servicesList = services.slice(0, 5)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  if (!servicesList.length) return null

  const activeService = servicesList[activeIndex] ?? servicesList[0]
  const palette = palettes[activeIndex % palettes.length]
  const features = activeService.features.slice(0, 4)

  return (
    <section id="capabilities" className="relative overflow-hidden border-t border-outline-variant/20 bg-[#0a0a0a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(255,184,123,0.1),transparent_22%),radial-gradient(circle_at_90%_72%,rgba(255,184,123,0.06),transparent_26%)]" />
      <div className="pointer-events-none absolute -right-24 top-24 font-headline text-[18rem] font-black leading-none tracking-[-0.12em] text-white/[0.025] sm:text-[27rem]">
        04
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end"
        >
          <div>
            <div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-primary">
              <span className="h-px w-10 bg-primary" />
              04 / What we do
            </div>
            <h2 className="max-w-3xl font-headline text-5xl font-black uppercase leading-[0.87] tracking-[-0.07em] text-on-surface sm:text-7xl lg:text-[7.2rem]">
              Services
              <span className="block text-primary">with intent.</span>
            </h2>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Every capability is designed to move a business forward, not simply make it look busy.
              Pick a discipline and see how we turn it into momentum.
            </p>
            <div className="mt-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
              <Sparkles className="h-4 w-4 text-primary" />
              Select a service to explore
            </div>
          </div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#151515] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:p-8 lg:p-10" style={{ transformStyle: 'preserve-3d' }} whileHover={reduceMotion ? undefined : { y: -6, rotateX: 1.5 }}
          >
            <div className={'absolute inset-0 bg-gradient-to-br ' + palette + ' opacity-90'} />
            <motion.div className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_18%)] opacity-50" animate={reduceMotion ? undefined : { x: ["-8%", "10%", "-8%"], y: ["-4%", "8%", "-4%"] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(255,255,255,0.35),transparent_18%),linear-gradient(135deg,rgba(0,0,0,0.1),rgba(0,0,0,0.6))]" />
            <div className="relative z-10 flex min-h-[30rem] flex-col justify-between sm:min-h-[34rem]">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.35em] text-black/60">
                    Active discipline
                  </span>
                  <div className="mt-3 font-headline text-7xl font-black leading-none tracking-[-0.09em] text-black/20 sm:text-9xl">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </div>
                </div>
                <Link
                  href={'/services/' + activeService.slug}
                  aria-label={'View ' + activeService.title + ' service'}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-primary transition-transform hover:rotate-45"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="flex flex-1 items-center justify-center py-8">
                <ServiceSignal index={activeIndex} reduceMotion={reduceMotion} />
              </div>

              <div>
                <motion.h3 initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.08 }} className="max-w-lg font-headline text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-black sm:text-6xl">
                  {activeService.title}
                </motion.h3>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-black/75 sm:text-base">
                  {activeService.description}
                </p>
              </div>
            </div>
          </motion.div>

          <div>
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">
                The index
              </span>
              <span className="font-label text-xs font-bold text-primary">
                {String(activeIndex + 1).padStart(2, '0')} / {String(servicesList.length).padStart(2, '0')}
              </span>
            </div>

            <div>
              {servicesList.map((service, index) => (
                <ServiceIndexRow
                  key={service.id}
                  service={service}
                  index={index}
                  active={activeIndex === index}
                  onSelect={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-7">
              <div className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Included in the thinking
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-on-surface-variant">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-4 border-b border-primary pb-3 text-[10px] font-black uppercase tracking-[0.35em] text-primary"
            >
              Start a conversation
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
