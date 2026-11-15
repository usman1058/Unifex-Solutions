'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import { MotionConfig } from 'framer-motion'
import ConsentBanner from '@/components/privacy/consent-banner'
import { useLayoutEffect } from 'react'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  useLayoutEffect(() => {
    // Route loading fallbacks can be shorter than the page we are leaving.
    // Reset before paint so the previous scroll position cannot land at the
    // new route's footer while its content is still streaming in.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    window.dispatchEvent(new Event('unifex:route-change'))
  }, [pathname])

  return (
    <MotionConfig reducedMotion="user">
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {!isAdminRoute && <Navbar />}
      <div id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </div>
      {!isAdminRoute && <Footer />}
      <Toaster />
      <SonnerToaster position="top-right" richColors closeButton />
      <ConsentBanner />
    </>
    </MotionConfig>
  )
}
