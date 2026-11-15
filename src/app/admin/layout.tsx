import type { Metadata } from 'next'
import AdminRootLayout from '@/components/admin/admin-root-layout'

export const metadata: Metadata = {
  title: {
    default: 'Admin | Unifex Solutions',
    template: '%s | Admin | Unifex Solutions',
  },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRootLayout>{children}</AdminRootLayout>
}
