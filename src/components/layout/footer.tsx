'use client'

import Link from 'next/link'
import { Terminal, Cpu, ShieldCheck } from 'lucide-react'
import NewsletterSignup from '@/components/home/newsletter-signup'

export default function Footer() {
  return (
    <footer className="w-full pt-24 pb-12 px-4 sm:px-6 md:px-12 flex flex-col gap-16 overflow-hidden bg-[#0a0a0a] border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
        {/* Company Branding Column */}
        <div className="lg:w-1/2">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 overflow-hidden rounded-xl border border-primary/40 bg-[#11120f] flex items-center justify-center">
              <img src="/logo.webp" alt="Unifex Solutions" className="h-full w-full object-cover" />
            </div>
            <span className="text-3xl font-black font-headline tracking-tighter uppercase text-on-surface">
              UNIFEX SOLUTIONS
            </span>
          </div>
          <p className="text-on-surface-variant font-label text-xs tracking-[0.2em] uppercase leading-relaxed max-w-md">
            EMPOWERING ENTERPRISES WITH HIGH-PERFORMANCE SOFTWARE, SECURE INFRASTRUCTURE, AND DIGITAL GROWTH SOLUTIONS.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="lg:w-1/2 w-full grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.2em] font-headline text-primary font-bold">NAVIGATION</span>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/services"
            >
              SERVICES
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/portfolio"
            >
              WORK
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/pricing"
            >
              PRICING
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/order"
            >
              START A PROJECT
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/blog"
            >
              JOURNAL
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.2em] font-headline text-primary font-bold">LEGAL & SAFETY</span>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/privacy"
            >
              PRIVACY POLICY
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/terms"
            >
              TERMS OF SERVICE
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors font-label text-xs tracking-wider uppercase"
              href="/faq"
            >
              FAQ
            </Link>
          </div>

          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <span className="text-xs uppercase tracking-[0.2em] font-headline text-primary font-bold">CONTACT</span>
            <p className="text-on-surface-variant font-label text-xs tracking-wider uppercase leading-relaxed">
              HELLO@UNIFEXSOLUTIONS.COM
              <br />
              +1 (555) 123-4567
              <br />
              NEW YORK // LONDON
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full lg:max-w-none lg:ml-auto lg:mr-0 lg:pl-[50%]">
        <NewsletterSignup />
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10 gap-4">
        <span className="text-[11px] uppercase tracking-[0.15em] font-label text-on-surface-variant text-center md:text-left">
          © {new Date().getFullYear()} UNIFEX SOLUTIONS. ALL RIGHTS RESERVED.
        </span>
        <div className="flex items-center gap-6">
          <Terminal className="w-4 h-4 text-primary opacity-70 hover:opacity-100 transition-opacity" />
          <img src="/logo.webp" alt="Unifex Solutions" className="h-5 w-5 rounded-full object-cover opacity-80 transition-opacity hover:opacity-100" />
          <Cpu className="w-4 h-4 text-primary opacity-70 hover:opacity-100 transition-opacity" />
          <ShieldCheck className="w-4 h-4 text-primary opacity-70 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </footer>
  )
}
