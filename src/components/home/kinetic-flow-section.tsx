'use client'

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, Check, Database, GitBranch, Radar, Rocket, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'

const steps = [
  {
    number: '01',
    short: 'Discover',
    title: 'Discovery & Strategy',
    description: 'We map the business, the users, and the risk before a line of code is written. The result is a clear technical direction with measurable outcomes.',
    signal: 'Understand the terrain',
    color: 'from-[#ffb87b] to-[#9c4d3f]',
    icon: Radar,
    checks: ['Business and user discovery', 'Security and technical audit', 'Prioritized delivery roadmap'],
  },
  {
    number: '02',
    short: 'Architect',
    title: 'System Architecture',
    description: 'We turn the strategy into a resilient system: data models, service boundaries, design systems, and security standards that are ready to scale.',
    signal: 'Build the blueprint',
    color: 'from-[#9de7c5] to-[#357b73]',
    icon: Database,
    checks: ['Scalable database schemas', 'Component and API architecture', 'Cloud and security foundations'],
  },
  {
    number: '03',
    short: 'Build',
    title: 'Agile Development',
    description: 'Small, visible delivery cycles turn the blueprint into a working product. Continuous integration, QA, and security testing keep momentum high.',
    signal: 'Make it real',
    color: 'from-[#c2baff] to-[#6659a6]',
    icon: GitBranch,
    checks: ['Full-stack product engineering', 'Automated testing and CI/CD', 'Weekly progress and demos'],
  },
  {
    number: '04',
    short: 'Evolve',
    title: 'Deployment & Optimization',
    description: 'Launch is the beginning of the next loop. We monitor, tune, and improve the system so it keeps creating value after it reaches production.',
    signal: 'Keep moving forward',
    color: 'from-[#f4b3a1] to-[#a94e61]',
    icon: Rocket,
    checks: ['Zero-downtime production release', 'Cloud monitoring and performance tuning', 'Continuous growth optimization'],
  },
]

function ProcessCore({ activeIndex, reduceMotion }: { activeIndex: number; reduceMotion: boolean | null }) {
  const activeStep = steps[activeIndex]
  const Icon = activeStep.icon

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[27rem]">
      <motion.div
        className={'absolute inset-0 rounded-full bg-gradient-to-br ' + activeStep.color + ' opacity-90'}
        animate={reduceMotion ? undefined : { rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-[8%] rounded-full border border-black/20 bg-black/10" />
      <motion.div
        className="absolute inset-[17%] rounded-full border border-white/40"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[29%] rounded-full border border-black/20 bg-black/10 backdrop-blur-sm" />
      <motion.div
        key={activeStep.number}
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-[37%] flex items-center justify-center rounded-full bg-black text-primary shadow-[0_0_70px_rgba(255,184,123,0.55)]"
      >
        <Icon className="h-9 w-9" strokeWidth={1.4} />
      </motion.div>
      <div className="absolute left-1/2 top-[-1.5rem] -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.35em] text-white/65">
        system core
      </div>
      <motion.div
        className="absolute -right-3 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-primary backdrop-blur-md"
        animate={reduceMotion ? undefined : { y: ['-50%', '-58%', '-50%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="h-5 w-5" />
      </motion.div>
      <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/70 backdrop-blur-md">
        {activeStep.signal}
      </div>
    </div>
  )
}

export default function KineticFlowSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.4 })
  const progressHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const nextIndex = Math.min(steps.length - 1, Math.floor(value * steps.length))
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
  })

  const activeStep = steps[activeIndex]
  const ActiveIcon = activeStep.icon

  return (
    <section ref={sectionRef} className="relative border-t border-outline-variant/15 bg-[#0a0a0a]" style={{ minHeight: '400vh' }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,184,123,0.08),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,transparent_70%,rgba(255,255,255,0.02))]" />

      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-16">
          <div className="relative flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-primary">
              <span className="h-px w-10 bg-primary" />
              Development methodology
            </div>
            <h2 className="max-w-xl font-headline text-5xl font-black uppercase leading-[0.86] tracking-[-0.07em] text-on-surface sm:text-7xl lg:text-[6.8rem]">
              The
              <span className="block text-primary">Kinetic Flow.</span>
            </h2>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-on-surface-variant sm:text-base">
              A complete system for moving from uncertainty to a dependable digital product. Scroll to move through the four stages.
            </p>
            <div className="mt-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
              <ArrowDown className="h-4 w-4 animate-bounce text-primary" />
              Scroll to advance
            </div>
            <div className="mt-12 hidden max-w-sm lg:block">
              <div className="mb-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                <span>System progress</span>
                <span className="text-primary">{activeStep.number} / 04</span>
              </div>
              <div className="relative h-1 overflow-hidden bg-white/10">
                <motion.div className="absolute inset-y-0 left-0 bg-primary" style={{ width: progressHeight }} />
              </div>
            </div>
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="order-2 lg:order-1">
              <div className="relative ml-2 h-[19rem] border-l border-white/15 sm:h-[23rem]">
                <motion.div className="absolute -left-px top-0 w-px bg-primary" style={{ height: progressHeight }} />
                <div className="flex h-full flex-col justify-between">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon
                    const isActive = activeIndex === index
                    return (
                      <motion.div
                        key={step.number}
                        animate={reduceMotion ? undefined : { opacity: isActive ? 1 : 0.42, x: isActive ? 8 : 0 }}
                        transition={{ duration: 0.35 }}
                        className="relative flex items-center gap-4"
                      >
                        <span className={[
                          'relative -left-[0.42rem] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-[#0a0a0a] transition-colors',
                          isActive ? 'border-primary text-primary' : 'border-white/20 text-white/40',
                        ].join(' ')}>
                          <StepIcon className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-label text-[10px] font-black uppercase tracking-[0.25em]">
                          {step.number} / {step.short}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <ProcessCore activeIndex={activeIndex} reduceMotion={reduceMotion} />
            </div>

            <motion.div
              key={activeStep.number}
              initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="order-3 border-t border-white/10 pt-7 lg:col-span-2"
            >
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                  <div className="mb-3 flex items-center gap-3 text-primary">
                    <ActiveIcon className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                      Stage {activeStep.number}
                    </span>
                  </div>
                  <h3 className="font-headline text-3xl font-black uppercase leading-none tracking-[-0.05em] text-on-surface sm:text-5xl">
                    {activeStep.title}
                  </h3>
                </div>
                <div>
                  <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {activeStep.description}
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    {activeStep.checks.map((check) => (
                      <div key={check} className="flex items-start gap-2 text-xs leading-relaxed text-white/65">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {check}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
