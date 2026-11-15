'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Loader2, Mail, Sparkles } from 'lucide-react'
import { FormEvent, useState } from 'react'

export default function NewsletterSignup() {
  const reduceMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || loading) return
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Subscription failed.')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary p-6 text-black sm:p-8">
      <motion.div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-black/20" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]"><Sparkles className="h-4 w-4" /> Field notes</span>
          <Mail aria-hidden="true" className="h-5 w-5" />
        </div>
        <h3 className="mt-8 max-w-xs font-headline text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em]">Ideas worth forwarding.</h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/70">Occasional notes on digital systems, product thinking, and the work behind the work.</p>
        {submitted ? (
          <p role="status" aria-live="polite" className="mt-8 border-t border-black/20 pt-5 text-base font-bold">You are on the signal list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex border-b border-black/40 pb-2">
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Your email" aria-label="Email address" autoComplete="email" className="min-h-12 min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-black/65" />
            <button type="submit" disabled={loading} aria-label={loading ? 'Subscribing' : 'Subscribe to newsletter'} className="min-h-12 min-w-12 flex items-center justify-center transition-transform hover:translate-x-1 disabled:opacity-60"><ArrowUpRight className="h-5 w-5" /></button>
          </form>
        )}
        {error && <p role="alert" aria-live="assertive" className="mt-4 text-sm font-semibold text-black">{error}</p>}
      </div>
    </div>
  )
}
