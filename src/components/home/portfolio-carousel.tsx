'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

type CaseStudy = {
  id: string
  slug: string
  title: string
  industry?: string | null
  thumbnailUrl?: string | null
}

type PortfolioCarouselProps = {
  projects: CaseStudy[]
}

const fallbackImage =
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop'

export default function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = projects.length

  useEffect(() => {
    if (reduceMotion || paused || total < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [paused, reduceMotion, total])

  if (!total) return null

  const goTo = (index: number) => {
    setActiveIndex((index + total) % total)
  }

  return (
    <section
      className="relative overflow-hidden border-t border-outline-variant/15 bg-surface-container-lowest py-24 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-8 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-3 block font-label text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Portfolio // Recent work
            </span>
            <h2 className="max-w-4xl font-headline text-5xl font-black uppercase leading-[0.86] tracking-[-0.07em] text-on-surface sm:text-7xl lg:text-[8rem]">
              Selected
              <span className="block text-primary">impact.</span>
            </h2>
          </motion.div>

          <div className="flex items-center gap-5 lg:pb-2">
            <span className="hidden text-right text-[10px] font-black uppercase leading-relaxed tracking-[0.25em] text-white/45 sm:block">
              Drag the work<br />to explore
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                aria-label="Previous project"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:bg-primary hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                aria-label="Next project"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-primary bg-primary text-black transition-transform hover:scale-105"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">
          <motion.div
            className="flex"
            animate={{ x: '-' + activeIndex * 100 + '%' }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            drag={reduceMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) goTo(activeIndex + 1)
              if (info.offset.x > 70) goTo(activeIndex - 1)
            }}
          >
            {projects.map((project, index) => (
              <article key={project.id} className="relative min-w-full">
                <Link href={'/portfolio/' + project.slug} className="group grid min-h-[32rem] lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-[20rem] overflow-hidden bg-surface-container-high lg:min-h-[36rem]">
                    <motion.img
                      src={project.thumbnailUrl || fallbackImage}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                      animate={reduceMotion || activeIndex !== index ? undefined : { scale: [1, 1.04, 1] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/15 to-transparent" />
                    <div className="absolute left-6 top-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 sm:left-10 sm:top-10">
                      <span className="h-px w-8 bg-primary" />
                      Project {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        {project.industry || 'Enterprise solution'}
                      </span>
                      <h3 className="mt-3 max-w-xl font-headline text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-5xl">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-surface-container-low p-6 sm:p-10 lg:p-12">
                    <div className="flex justify-end">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary text-primary transition-all duration-500 group-hover:rotate-45 group-hover:bg-primary group-hover:text-black">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Case study
                      </span>
                      <p className="mt-5 max-w-sm text-sm leading-relaxed text-on-surface-variant sm:text-base">
                        Explore the thinking, architecture, and measurable outcome behind this build.
                      </p>
                      <div className="mt-8 h-px w-full bg-white/10">
                        <motion.div
                          className="h-px bg-primary"
                          initial={{ width: '0%' }}
                          animate={{ width: activeIndex === index ? '100%' : '0%' }}
                          transition={{ duration: 5.2, ease: 'linear' }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={'Show project ' + (index + 1)}
                className="group flex h-8 items-center"
              >
                <span className={[
                  'block h-px transition-all duration-500',
                  activeIndex === index ? 'w-12 bg-primary' : 'w-5 bg-white/25 group-hover:bg-white/60',
                ].join(' ')} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/45 transition-colors hover:text-primary"
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            {paused ? 'Play reel' : 'Pause reel'}
          </button>
        </div>
      </div>
    </section>
  )
}
