'use client'

import { usePathname, useRouter } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/contexts/admin-auth-context'
import { useEffect, type ReactNode } from 'react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AutoSchedulerTicker from '@/components/admin/auto-scheduler-ticker'
import { Loader2 } from 'lucide-react'

function AdminContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAuthenticated) router.replace('/admin/login')
  }, [isAuthenticated, isLoading, router, isLoginPage])

  if (isLoginPage) return <>{children}</>

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" aria-label="Checking admin session">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <AutoSchedulerTicker />
      <div className="flex">
        <AdminSidebar />
        <main className="min-h-screen min-w-0 flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminContent>{children}</AdminContent>
    </AdminAuthProvider>
  )
}
