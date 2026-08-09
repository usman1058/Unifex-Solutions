'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Mail,
  LogOut,
  Menu,
  X,
  Settings,
  CalendarClock,
  ClipboardList
} from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '@/contexts/admin-auth-context'

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Social Scheduler', href: '/admin/social', icon: CalendarClock },
  { name: 'Contact Forms', href: '/admin/contact', icon: Mail },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAdminAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close admin navigation' : 'Open admin navigation'}
        aria-expanded={mobileMenuOpen}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[min(18rem,calc(100vw-2rem))] bg-card border-r border-outline-variant/20
        transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 sm:p-6 border-b border-outline-variant/20">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                U
              </div>
              <div>
                <div className="font-bold text-lg">Unifex</div>
                <div className="text-xs text-muted-foreground">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
