'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import ConsentBanner from '@/components/privacy/consent-banner'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        {children}
      </div>
      {!isAdminRoute && <Footer />}
      <Toaster />
      <SonnerToaster position="top-right" richColors closeButton />
      <ConsentBanner />
    </>
  )
}