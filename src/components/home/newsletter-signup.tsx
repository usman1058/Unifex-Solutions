'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Sparkles } from 'lucide-react'
import { FormEvent, useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary p-6 text-black sm:p-8">
      <motion.div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-black/20" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]"><Sparkles className="h-4 w-4" /> Field notes</span>
          <Mail className="h-5 w-5" />
        </div>
        <h3 className="mt-8 max-w-xs font-headline text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em]">Ideas worth forwarding.</h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/70">Occasional notes on digital systems, product thinking, and the work behind the work.</p>
        {submitted ? (
          <div className="mt-8 border-t border-black/20 pt-5 text-xs font-black uppercase tracking-[0.2em]">You are on the signal list.</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex border-b border-black/40 pb-2">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="YOUR EMAIL" aria-label="Email address" className="min-w-0 flex-1 bg-transparent text-xs font-bold uppercase tracking-[0.18em] outline-none placeholder:text-black/50" />
            <button type="submit" aria-label="Subscribe to newsletter" className="transition-transform hover:translate-x-1"><ArrowUpRight className="h-5 w-5" /></button>
          </form>
        )}
      </div>
    </div>
  )
}
