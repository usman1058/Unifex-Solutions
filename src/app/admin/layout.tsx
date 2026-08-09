'use client'

import { usePathname } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/contexts/admin-auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AutoSchedulerTicker from '@/components/admin/auto-scheduler-ticker'
import { Loader2 } from 'lucide-react'

function AdminContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router, isLoginPage])

  // For login page, just render children without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AutoSchedulerTicker />
      <div className="flex">
        <AdminSidebar />
        <main className="min-w-0 flex-1 min-h-screen">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <AdminContent>{children}</AdminContent>
    </AdminAuthProvider>
  )
}
