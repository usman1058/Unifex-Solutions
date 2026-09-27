'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Briefcase, CalendarClock, ChevronRight, CircleUserRound, ClipboardList, ExternalLink, FileText, Film, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, PanelLeftClose, PanelLeftOpen, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '@/contexts/admin-auth-context'

const menuGroups = [
  { label: 'Workspace', items: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  ] },
  { label: 'Operations', items: [
    { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
    { name: 'Video Clipper', href: '/admin/video', icon: Film },
    { name: 'Social Scheduler', href: '/admin/social', icon: CalendarClock },
    { name: 'Contact Forms', href: '/admin/contact', icon: Mail },
  ] },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAdminAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return <>
    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close admin navigation' : 'Open admin navigation'} aria-expanded={mobileMenuOpen} className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden">{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>

    <aside className={`fixed inset-y-0 left-0 z-40 w-[min(19rem,calc(100vw-2rem))] transform border-r border-outline-variant/20 bg-card transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-[5.5rem]' : 'lg:w-[19rem]'}`}>
      <div className="flex h-full flex-col">
        <div className={`border-b border-outline-variant/20 p-4 ${collapsed ? 'lg:px-3' : 'sm:p-6'}`}>
          <div className={`flex items-center ${collapsed ? 'lg:justify-center' : 'justify-between gap-3'}`}>
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-[0_0_24px_rgba(213,255,0,0.18)]">U</div>
              <div className={collapsed ? 'lg:hidden' : ''}><div className="font-bold tracking-tight">Unifex</div><div className="text-[11px] text-muted-foreground">Admin workspace</div></div>
            </Link>
            <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:block">{collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}</button>
          </div>
        </div>

        <nav className={`flex-1 space-y-6 overflow-y-auto p-3 ${collapsed ? 'lg:px-3' : 'sm:p-4'}`} aria-label="Admin navigation">
          {menuGroups.map((group) => <div key={group.label}><p className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 ${collapsed ? 'lg:hidden' : ''}`}>{group.label}</p><div className="space-y-1">{group.items.map((item) => { const active = pathname === item.href || pathname.startsWith(item.href + '/'); const Icon = item.icon; return <Link key={item.name} href={item.href} title={collapsed ? item.name : undefined} onClick={() => setMobileMenuOpen(false)} className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${collapsed ? 'lg:justify-center lg:px-2' : ''} ${active ? 'bg-primary font-semibold text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="h-[18px] w-[18px] shrink-0" /><span className={collapsed ? 'lg:hidden' : ''}>{item.name}</span>{active && <ChevronRight className={`ml-auto h-4 w-4 ${collapsed ? 'lg:hidden' : ''}`} />}</Link> })}</div></div>)}
          <div><p className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 ${collapsed ? 'lg:hidden' : ''}`}>Configuration</p><Link href="/admin/settings" title={collapsed ? 'Settings' : undefined} onClick={() => setMobileMenuOpen(false)} className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${collapsed ? 'lg:justify-center lg:px-2' : ''} ${pathname.startsWith('/admin/settings') ? 'bg-primary font-semibold text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Settings className="h-[18px] w-[18px] shrink-0" /><span className={collapsed ? 'lg:hidden' : ''}>Settings</span></Link></div>
        </nav>

        <div className={`border-t border-outline-variant/20 p-3 ${collapsed ? 'lg:px-3' : 'sm:p-4'}`}>
          <div className={`mb-3 rounded-xl border border-primary/15 bg-primary/[0.05] p-3 ${collapsed ? 'lg:flex lg:justify-center' : ''}`} title="Publishing system status"><div className="flex items-center gap-2"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span><span className={`text-xs font-medium ${collapsed ? 'lg:hidden' : ''}`}>System operational</span><Activity className={`ml-auto h-3.5 w-3.5 text-emerald-500 ${collapsed ? 'lg:hidden' : ''}`} /></div></div>
          <div className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}><CircleUserRound className="h-5 w-5 text-primary" /><div className={collapsed ? 'lg:hidden' : ''}><p className="text-xs font-semibold">Administrator</p><p className="text-[10px] text-muted-foreground">Full access</p></div></div>
          <Link href="/" target="_blank" className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${collapsed ? 'lg:justify-center lg:px-2' : ''}`} title={collapsed ? 'View website' : undefined}><ExternalLink className="h-4 w-4" /><span className={collapsed ? 'lg:hidden' : ''}>View website</span></Link>
          <button onClick={logout} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ${collapsed ? 'lg:justify-center lg:px-2' : ''}`} title={collapsed ? 'Logout' : undefined}><LogOut className="h-4 w-4" /><span className={collapsed ? 'lg:hidden' : ''}>Logout</span></button>
        </div>
      </div>
    </aside>
    {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
  </>
}
