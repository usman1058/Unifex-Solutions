'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Activity, Layers3, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { AnimatedCounter } from '@/components/ui/motion-wrapper'

type Metric = {
  id: string
  value: string
  label: string
}

const icons = [Activity, Users, Layers3, ShieldCheck]

export default function MetricsSection({ stats }: { stats: Metric[] }) {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const visibleStats = stats.slice(0, 4)

  return (
    <section className="relative overflow-hidden border-y border-outline-variant/15 bg-[#151515] py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,184,123,0.08),transparent_28%,transparent_72%,rgba(255,184,123,0.04))]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-16 lg:flex-row lg:items-end">
          <div>
            <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.35em] text-primary">Performance // In numbers</span>
            <h2 className="font-headline text-4xl font-black uppercase leading-none tracking-[-0.06em] text-on-surface sm:text-6xl">Proof, not noise.</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">A few signals from the systems, teams, and outcomes we help move forward.</p>
        </div>

        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {visibleStats.map((stat, index) => {
            const Icon = icons[index % icons.length]
            const isActive = active === index
            return (
              <motion.button
                key={stat.id}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className={[
                  'group relative min-h-[15rem] overflow-hidden bg-[#151515] p-6 text-left transition-colors sm:p-8',
                  isActive ? 'bg-[#201b18]' : 'hover:bg-[#1c1c1c]',
                ].join(' ')}
              >
                <div className="flex items-start justify-between">
                  <Icon className={isActive ? 'h-5 w-5 text-primary' : 'h-5 w-5 text-white/35'} />
                  <span className="font-label text-[10px] font-bold tracking-[0.25em] text-white/30">0{index + 1}</span>
                </div>
                <div className="mt-12">
                  <AnimatedCounter value={stat.value} className="font-headline text-5xl font-black tracking-[-0.08em] text-primary sm:text-6xl" />
                  <span className="mt-3 block max-w-[10rem] text-[10px] font-black uppercase leading-relaxed tracking-[0.22em] text-on-surface-variant">{stat.label}</span>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-primary"
                  initial={false}
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
                <ArrowUpRight className="absolute bottom-6 right-6 h-4 w-4 text-white/20 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
