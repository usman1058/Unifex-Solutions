'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowLeft, CheckCircle2, AlertCircle, Upload, Lock, Loader2, Check, FileText } from 'lucide-react'
import Link from 'next/link'

interface ServiceOption {
  id: string
  slug: string
  title: string
  description: string
  pricing: string | null
}

interface OrderFlowProps {
  services: ServiceOption[]
  bankDetails?: Record<string, string>
  initialServiceSlug?: string
}

type Step = 'service' | 'details' | 'payment' | 'success'

interface CreatedOrder {
  orderNumber: string
  status: string
  paymentStatus: string
}

export default function OrderFlow({ services, bankDetails = {}, initialServiceSlug }: OrderFlowProps) {
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    details: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'bank_receipt' | 'card'>('bank_receipt')
  const [receiptFile, setReceiptFile] = useState<{ name: string; url: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null)
  const [transition, setTransition] = useState<string | null>(null)

  const steps = useMemo(
    () => [
      { key: 'service' as const, label: 'Select Service' },
      { key: 'details' as const, label: 'Project Brief' },
      { key: 'payment' as const, label: 'Payment' },
      { key: 'success' as const, label: 'Confirmation' },
    ],
    []
  )

  const currentIndex = steps.findIndex((s) => s.key === step)

  useEffect(() => {
    if (!initialServiceSlug || selectedService) return
    const service = services.find((item) => item.slug === initialServiceSlug)
    if (service) {
      setSelectedService(service)
      setStep('details')
    }
  }, [initialServiceSlug, services, selectedService])

  const selectService = (service: ServiceOption) => {
    setSelectedService(service)
    changeStep('details', 'Preparing your project brief')
  }

  const changeStep = (nextStep: Step, label: string) => {
    setTransition(label)
    window.setTimeout(() => {
      setStep(nextStep)
      setTransition(null)
    }, 520)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const response = await fetch('/api/uploads', { method: 'POST', body: fd })
      const data = await response.json()
      if (response.ok && data.success) {
        setReceiptFile({ name: file.name, url: data.data.url })
      } else {
        setError(data.error?.message || 'Upload failed. Please try again.')
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const submitOrder = async () => {
    if (paymentMethod === 'card') {
      setError('Card payments are not available yet. Please choose Bank Transfer.')
      setPaymentMethod('bank_receipt')
      return
    }
    if (paymentMethod === 'bank_receipt' && !receiptFile) {
      setError('Please upload your bank transfer receipt.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceSlug: selectedService?.slug,
          serviceTitle: selectedService?.title,
          paymentMethod,
          receiptUrl: receiptFile?.url,
          receiptFileName: receiptFile?.name,
        }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setCreatedOrder(data.data)
        changeStep('success', 'Securing your engagement reference')
      } else {
        setError(data.error?.message || 'Order submission failed. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <AnimatePresence>
        {transition && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 p-6 backdrop-blur-xl">
            <div className="text-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 border-t-primary"><span className="font-headline text-2xl font-black text-primary">UF</span></motion.div><p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{transition}</p><div className="mx-auto mt-5 h-px w-48 overflow-hidden bg-white/10"><motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 0.52 }} className="h-full bg-primary" /></div></div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Stepper */}
      <div className="mb-16">
        <div className="flex flex-wrap items-center gap-2 md:gap-0">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-colors ${
                  i <= currentIndex ? 'border-primary bg-primary text-black' : 'border-outline-variant/30 text-on-surface/40'
                }`}>
                  {i < currentIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] font-black tracking-[0.25em] uppercase italic ${
                  i <= currentIndex ? 'text-on-surface' : 'text-on-surface/40'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-4 md:mx-6 w-8 md:w-16 h-px bg-outline-variant/30 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Select Service */}
        {step === 'service' && (
          <motion.div
            key="service"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-[10px] font-black tracking-[0.5em] text-primary mb-10 uppercase italic block">
              Step 01 // Select Your Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/10 border border-outline-variant/10">
              {services.map((service, i) => (
                <button
                  key={service.id}
                  onClick={() => selectService(service)}
                  className="bg-surface p-8 md:p-12 hover:bg-surface-container-high transition-all duration-500 group text-left relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-10">
                    <span className="text-4xl font-headline font-black text-on-surface/10 group-hover:text-primary/20 transition-colors italic">
                      0{i + 1}
                    </span>
                    <div className="w-8 h-8 border border-outline-variant/20 rotate-45 group-hover:rotate-0 group-hover:bg-primary group-hover:border-primary transition-all duration-500 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-black opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-headline font-black tracking-tighter mb-4 group-hover:text-primary transition-colors uppercase">
                    {service.title}
                  </h3>
                  <p className="text-xs md:text-sm text-on-surface/70 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </button>
              ))}
            </div>
            {services.length === 0 && (
              <div className="border border-outline-variant/20 p-16 text-center bg-surface-container-low">
                <p className="text-xs font-label tracking-widest text-on-surface/40 uppercase">No services available yet.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: Details */}
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/10 p-8 md:p-14">
                <h2 className="text-[10px] font-black tracking-[0.5em] text-primary mb-12 uppercase italic block">
                  Step 02 // Project Brief
                </h2>

                {error && (
                  <div className="mb-10 border border-red-500/40 bg-red-500/10 p-5 flex items-center gap-4 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-black tracking-widest uppercase">{error}</p>
                  </div>
                )}

                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name..."
                        className="w-full bg-transparent border-b border-outline-variant/30 py-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full bg-transparent border-b border-outline-variant/30 py-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+44 0000 000000"
                        className="w-full bg-transparent border-b border-outline-variant/30 py-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Company (Optional)</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company name..."
                        className="w-full bg-transparent border-b border-outline-variant/30 py-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Estimated Budget (Optional)</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. £5,000 - £10,000"
                      className="w-full bg-transparent border-b border-outline-variant/30 py-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">Project Details *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Describe your project, requirements, timeline..."
                      className="w-full bg-transparent border border-outline-variant/20 p-6 text-xs md:text-sm font-black tracking-[0.2em] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surface/20 resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap justify-between gap-6 pt-8 border-t border-outline-variant/10">
                    <button
                      onClick={() => changeStep('service', 'Returning to service selection')}
                      className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.4em] text-on-surface/60 hover:text-on-surface transition-colors uppercase"
                    >
                      <ArrowLeft className="w-4 h-4" /> BACK
                    </button>
                    <button
                      onClick={() => {
                        if (!formData.name || !formData.email || !formData.details) {
                          setError('Name, email, and project details are required.')
                          return
                        }
                        setError('')
                        changeStep('payment', 'Opening secure payment step')
                      }}
                      className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.4em] text-primary hover:text-white transition-colors uppercase"
                    >
                      CONTINUE TO PAYMENT <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-4">
                <div className="bg-surface-container-low border border-outline-variant/10 p-8 sticky top-28">
                  <h3 className="text-[10px] font-black tracking-[0.5em] text-primary mb-8 uppercase italic block">Order Summary</h3>
                  <div className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase">
                    <div>
                      <p className="text-on-surface/50 mb-2">Service</p>
                      <p className="text-on-surface">{selectedService?.title}</p>
                    </div>
                    <div>
                      <p className="text-on-surface/50 mb-2">Name</p>
                      <p className="text-on-surface">{formData.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-on-surface/50 mb-2">Email</p>
                      <p className="text-on-surface">{formData.email || '—'}</p>
                    </div>
                    <div>
                      <p className="text-on-surface/50 mb-2">Budget</p>
                      <p className="text-on-surface">{formData.budget || '—'}</p>
                    </div>
                    <div className="pt-6 border-t border-outline-variant/10">
                      <Link href="/services" className="text-primary hover:text-white transition-colors">← View All Services</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Payment */}
        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/10 p-8 md:p-14">
                <h2 className="text-[10px] font-black tracking-[0.5em] text-primary mb-12 uppercase italic block">
                  Step 03 // Payment
                </h2>

                {error && (
                  <div className="mb-10 border border-red-500/40 bg-red-500/10 p-5 flex items-center gap-4 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-black tracking-widest uppercase">{error}</p>
                  </div>
                )}

                {/* Card option - decorative, not yet enabled */}
                <div className="flex justify-end mb-8">
                  <div className="relative group" title="Not available yet">
                    <div className="border border-outline-variant/30 px-6 py-3 flex items-center gap-3 opacity-60 cursor-not-allowed">
                      <Lock className="w-4 h-4 text-on-surface/50" />
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase text-on-surface/60">
                        Pay with Card — Coming Soon
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bank transfer - the working method */}
                <div className={`border p-8 md:p-10 transition-colors ${paymentMethod === 'bank_receipt' ? 'border-primary bg-primary/5' : 'border-outline-variant/20'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-headline font-black tracking-tighter uppercase">Bank Transfer</h3>
                      <p className="text-[10px] font-black tracking-[0.25em] text-on-surface/60 uppercase mt-2">Currently the only accepted payment method</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                  </div>

                  <div className="bg-background border border-outline-variant/10 p-6 mb-8 text-[10px] font-black tracking-[0.2em] uppercase leading-loose">
                    <p className="text-on-surface/50 mb-2">Transfer to the following account:</p>
                    {bankDetails.bank_account_name && (
                      <p className="text-on-surface mb-2">Account Name: {bankDetails.bank_account_name}</p>
                    )}
                    {bankDetails.bank_account_number && (
                      <p className="text-on-surface mb-2">Account Number: {bankDetails.bank_account_number}</p>
                    )}
                    {bankDetails.bank_sort_code && (
                      <p className="text-on-surface mb-2">Sort Code: {bankDetails.bank_sort_code}</p>
                    )}
                    {bankDetails.bank_iban && (
                      <p className="text-on-surface mb-2">IBAN: {bankDetails.bank_iban}</p>
                    )}
                    {bankDetails.bank_swift && (
                      <p className="text-on-surface mb-2">SWIFT / BIC: {bankDetails.bank_swift}</p>
                    )}
                    {bankDetails.bank_address && (
                      <p className="text-on-surface mb-2">Bank Address: {bankDetails.bank_address}</p>
                    )}
                    <p className="text-on-surface">
                      {bankDetails.bank_instructions || 'Use your order number as the payment reference.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black tracking-[0.3em] text-on-surface/70 uppercase italic block">
                      Upload Transfer Receipt *
                    </label>
                    <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-outline-variant/30 hover:border-primary transition-colors cursor-pointer p-10 text-center">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.gif,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUpload(file)
                        }}
                      />
                      {uploading ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      ) : receiptFile ? (
                        <FileText className="w-8 h-8 text-primary" />
                      ) : (
                        <Upload className="w-8 h-8 text-on-surface/50" />
                      )}
                      <div>
                        {uploading ? (
                          <p className="text-xs font-black tracking-widest uppercase text-primary">Uploading…</p>
                        ) : receiptFile ? (
                          <>
                            <p className="text-xs font-black tracking-widest uppercase text-on-surface">{receiptFile.name}</p>
                            <p className="text-[9px] tracking-widest uppercase text-on-surface/50 mt-1">Click to replace</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-black tracking-widest uppercase text-on-surface">Click to upload receipt</p>
                            <p className="text-[9px] tracking-widest uppercase text-on-surface/50 mt-1">PNG, JPG, PDF · Max 10MB</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between gap-6 pt-10 border-t border-outline-variant/10 mt-10">
                  <button
                    onClick={() => changeStep('details', 'Returning to your brief')}
                    className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.4em] text-on-surface/60 hover:text-on-surface transition-colors uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                  <button
                    onClick={submitOrder}
                    disabled={submitting}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-black text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-colors disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {submitting ? 'SUBMITTING…' : 'SUBMIT ORDER'}
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-4">
                <div className="bg-surface-container-low border border-outline-variant/10 p-8 sticky top-28">
                  <h3 className="text-[10px] font-black tracking-[0.5em] text-primary mb-8 uppercase italic block">Order Summary</h3>
                  <div className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase">
                    <div>
                      <p className="text-on-surface/50 mb-2">Service</p>
                      <p className="text-on-surface">{selectedService?.title}</p>
                    </div>
                    <div>
                      <p className="text-on-surface/50 mb-2">Payment Method</p>
                      <p className="text-on-surface">Bank Transfer</p>
                    </div>
                    <div>
                      <p className="text-on-surface/50 mb-2">Receipt</p>
                      <p className="text-on-surface">{receiptFile ? 'Uploaded ✓' : 'Pending'}</p>
                    </div>
                    <div className="pt-6 border-t border-outline-variant/10">
                      <p className="text-on-surface/50 mb-2">Note</p>
                      <p className="text-on-surface/80 normal-case tracking-normal leading-relaxed text-[10px]">
                        Our team verifies your receipt and will contact you to confirm next steps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Success */}
        {step === 'success' && createdOrder && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto text-center border border-outline-variant/15 p-10 md:p-16 bg-surface-container-low"
          >
            <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-10 bg-primary/5">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-7xl font-headline font-black tracking-tighter uppercase mb-6 italic">
              ORDER RECEIVED.
            </h1>
            <p className="text-xs font-black tracking-[0.3em] text-on-surface/80 uppercase leading-relaxed mb-12 italic">
              THANK YOU. YOUR ENGAGEMENT IS NOW IN OUR SYSTEM.
            </p>

            <div className="border border-outline-variant/15 bg-background p-8 md:p-10 mb-12">
              <div className="space-y-6 text-[10px] font-black tracking-[0.25em] uppercase">
                <div>
                  <p className="text-on-surface/50 mb-2">Your Order Reference</p>
                  <p className="text-2xl md:text-3xl font-headline font-black tracking-tighter text-primary italic">{createdOrder.orderNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-on-surface/50 mb-2">Order Status</p>
                    <p className="text-on-surface uppercase">{createdOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-on-surface/50 mb-2">Payment Status</p>
                    <p className="text-on-surface uppercase">{createdOrder.paymentStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-black tracking-[0.25em] text-on-surface/60 uppercase leading-relaxed mb-12">
              SAVE YOUR REFERENCE NUMBER. USE IT WITH YOUR EMAIL TO <Link href="/order/status" className="text-primary hover:text-white transition-colors">TRACK YOUR ORDER</Link>.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/order/status"
                className="px-12 py-5 bg-primary text-black text-[10px] font-black tracking-[0.5em] uppercase hover:bg-white transition-colors"
              >
                TRACK ORDER
              </Link>
              <Link
                href="/"
                className="px-12 py-5 border border-outline-variant/30 text-on-surface text-[10px] font-black tracking-[0.5em] uppercase hover:border-primary hover:text-primary transition-colors"
              >
                BACK HOME
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
