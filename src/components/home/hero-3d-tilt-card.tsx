'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, Cpu, ShieldCheck, Terminal, Zap } from 'lucide-react'
import { MouseEvent, useState } from 'react'

export function Hero3DTiltCard() {
  const [activeTab, setActiveTab] = useState<'status' | 'code'>('status')
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for 3D tilt physics
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 25 })
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className="perspective-1000 w-full max-w-lg mx-auto lg:mx-0">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full rounded-2xl bg-surface-container/90 border border-outline-variant/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-shadow hover:border-primary/50 group overflow-hidden"
      >
        {/* Dynamic specular glare overlay */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(245, 158, 11, 0.15), transparent 60%)`,
          }}
          className="absolute inset-0 pointer-events-none rounded-2xl z-10 transition-opacity opacity-0 group-hover:opacity-100"
        />

        {/* Floating 3D Badge header */}
        <div style={{ transform: 'translateZ(30px)' }} className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-label font-bold tracking-widest text-on-surface uppercase block">
                UNIFEX KINETIC CORE
              </span>
              <span className="text-[10px] text-primary font-mono tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                V2.6.0 // ACTIVE ARCHITECTURE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-md border border-outline-variant/20">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-2.5 py-1 text-[10px] font-label tracking-wider uppercase rounded transition-colors ${
                activeTab === 'status' ? 'bg-primary text-black font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              METRICS
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2.5 py-1 text-[10px] font-label tracking-wider uppercase rounded transition-colors ${
                activeTab === 'code' ? 'bg-primary text-black font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              CONSOLE
            </button>
          </div>
        </div>

        {/* Tab 1: Live Status & Metrics */}
        {activeTab === 'status' ? (
          <div style={{ transform: 'translateZ(25px)' }} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-background/60 border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-label text-on-surface font-semibold block">ZERO TRUST SECURITY</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">SOC 2 TYPE II COMPLIANT</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">100% SECURE</span>
            </div>

            <div className="p-3.5 rounded-xl bg-background/60 border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-label text-on-surface font-semibold block">GLOBAL CDN & MICROSERVICES</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">SUB-50MS EDGE LATENCY</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">99.99% UPTIME</span>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-label tracking-widest text-on-surface-variant/70 uppercase block mb-2">
                ENTERPRISE STACK PILOT:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['NEXT.JS 16', 'TYPESCRIPT 5', 'PRISMA ORM', 'POSTGRES', 'TAILWIND 4', 'DOCKER'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Console Code Preview */
          <div style={{ transform: 'translateZ(25px)' }} className="p-4 rounded-xl bg-black/80 border border-outline-variant/30 font-mono text-[11px] leading-relaxed text-amber-300/90 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-on-surface-variant pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                unifex-engine.config.ts
              </span>
              <span className="text-emerald-400">● EXECUTION SUCCESS</span>
            </div>
            <p className="text-on-surface-variant">// Initializing Unifex Enterprise Stack</p>
            <p><span className="text-purple-400">import</span> &#123; KineticCore &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@unifex/core&apos;</span>;</p>
            <p><span className="text-blue-400">export const</span> app = <span className="text-yellow-400">new</span> KineticCore(&#123;</p>
            <p className="pl-4">security: <span className="text-emerald-300">&apos;ZERO_TRUST_STRICT&apos;</span>,</p>
            <p className="pl-4">performance: &#123; targetFCP: <span className="text-orange-400">0.4</span> &#125;,</p>
            <p className="pl-4">scalability: <span className="text-purple-400">true</span>,</p>
            <p>&#125;);</p>
          </div>
        )}

        {/* Card Footer CTA */}
        <div style={{ transform: 'translateZ(35px)' }} className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-[11px] font-label tracking-widest text-on-surface-variant uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            READY FOR DEPLOYMENT
          </span>
          <a
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-label font-bold tracking-wider text-primary hover:text-white transition-colors"
          >
            CONSULT OUR ARCHITECTS
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </div>
  )
}
