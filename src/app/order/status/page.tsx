'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface OrderStatusResult {
  orderNumber: string
  serviceTitle: string
  name: string
  status: string
  paymentStatus: string
  adminMessage: string | null
  createdAt: string
  updatedAt: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'PENDING REVIEW',
  paid: 'PAID',
  processing: 'IN PROGRESS',
  completed: 'COMPLETED',
  rejected: 'REJECTED',
  cancelled: 'CANCELLED',
}

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: 'UNPAID',
  pending: 'RECEIPT PENDING VERIFICATION',
  paid: 'PAID',
  refunded: 'REFUNDED',
}

export default function OrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'notfound' | 'error'>('idle')
  const [result, setResult] = useState<OrderStatusResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('searching')
    setError('')
    try {
      const response = await fetch('/api/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setResult(data.data)
        setStatus('found')
      } else {
        setStatus('notfound')
      }
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <main className="bg-background text-on-surface overflow-x-hidden min-h-screen pt-24">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-5xl">
            <span className="text-[10px] font-black tracking-[0.6em] text-primary mb-8 uppercase italic block">
              Tracking // Order Status
            </span>
            <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase text-on-surface">
              TRACK YOUR <br /> <span className="text-on-surface/50 italic">ENGAGEMENT.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-outline-variant/10">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          {status !== 'found' ? (
            <div className="bg-surface-container-low border border-outline-variant/10 p-8 md:p-14">
              <h2 className="text-[10px] font-black tracking-[0.5em] text-primary mb-10 uppercase italic block">
                Enter Your Reference
              </h2>

              {status === 'notfound' && (
                <div className="mb-10 border border-red-500/40 bg-red-500/10 p-5 flex items-center gap-4 text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs font-black tracking-widest uppercase">No order found for that number and email.</p>
                </div>
              )}
              {status === 'error' && (
                <div className="mb-10 border border-red-500/40 bg-red-500/10 p-5 flex items-center gap-4 text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs font-black tracking-widest uppercase">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Order Reference *</label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                    placeholder="UF-2026-0001"
                    className="w-full bg-transparent border-b-2 border-outline-variant/30 py-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Email Used *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-transparent border-b-2 border-outline-variant/30 py-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'searching'}
                  className="w-full flex justify-between items-center group py-6 border-t border-outline-variant/15"
                >
                  <span className="text-2xl md:text-4xl font-headline font-black tracking-tighter uppercase italic group-hover:text-primary transition-colors leading-none">
                    {status === 'searching' ? 'SEARCHING...' : 'TRACK ORDER.'}
                  </span>
                  <div className="w-14 h-14 rounded-full border border-outline-variant/30 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                    {status === 'searching' ? (
                      <Loader2 className="w-6 h-6 text-on-surface animate-spin" />
                    ) : (
                      <Search className="w-6 h-6 text-on-surface group-hover:text-black transition-colors" />
                    )}
                  </div>
                </button>
              </form>
            </div>
          ) : (
            result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface-container-low border border-outline-variant/15 p-8 md:p-14"
              >
                <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-10 bg-primary/5">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center mb-12">
                  <p className="text-[10px] font-black tracking-[0.4em] text-on-surface/50 uppercase mb-3">Order Reference</p>
                  <p className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-primary italic">{result.orderNumber}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <div className="border border-outline-variant/15 bg-background p-6">
                    <p className="text-[9px] font-black tracking-[0.3em] text-on-surface/50 uppercase mb-3">Order Status</p>
                    <p className="text-sm font-black tracking-[0.2em] uppercase text-on-surface">{STATUS_LABELS[result.status] || result.status}</p>
                  </div>
                  <div className="border border-outline-variant/15 bg-background p-6">
                    <p className="text-[9px] font-black tracking-[0.3em] text-on-surface/50 uppercase mb-3">Payment Status</p>
                    <p className="text-sm font-black tracking-[0.2em] uppercase text-on-surface">{PAYMENT_LABELS[result.paymentStatus] || result.paymentStatus}</p>
                  </div>
                  <div className="border border-outline-variant/15 bg-background p-6">
                    <p className="text-[9px] font-black tracking-[0.3em] text-on-surface/50 uppercase mb-3">Service</p>
                    <p className="text-sm font-black tracking-[0.2em] uppercase text-on-surface">{result.serviceTitle}</p>
                  </div>
                  <div className="border border-outline-variant/15 bg-background p-6">
                    <p className="text-[9px] font-black tracking-[0.3em] text-on-surface/50 uppercase mb-3">Placed On</p>
                    <p className="text-sm font-black tracking-[0.2em] uppercase text-on-surface">{new Date(result.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {result.adminMessage && (
                  <div className="border border-primary/30 bg-primary/5 p-6 mb-12">
                    <p className="text-[9px] font-black tracking-[0.3em] text-primary uppercase mb-3">Message From Our Team</p>
                    <p className="text-xs font-medium text-on-surface/90 leading-relaxed">{result.adminMessage}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-10 py-4 border border-outline-variant/30 text-on-surface text-[10px] font-black tracking-[0.4em] uppercase hover:border-primary hover:text-primary transition-colors"
                  >
                    TRACK ANOTHER
                  </button>
                  <Link
                    href="/order"
                    className="px-10 py-4 bg-primary text-black text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-colors"
                  >
                    NEW ORDER
                  </Link>
                </div>
              </motion.div>
            )
          )}

          <div className="mt-10 text-center">
            <Link href="/order" className="text-[10px] font-black tracking-[0.3em] text-on-surface/50 hover:text-primary transition-colors uppercase">
              ← Start A New Order
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}