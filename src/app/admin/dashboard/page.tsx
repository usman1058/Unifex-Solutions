'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Activity, ArrowUpRight, Briefcase, CalendarClock, CheckCircle2, ChevronRight, ClipboardList, FileText, Film, Mail, MessageSquare, Plus, RefreshCw, Settings2, ShieldCheck, Sparkles, Users, XCircle } from 'lucide-react'

interface Stats { services: number; blogPosts: number; testimonials: number; contactForms: number; orders: number }
interface ScheduledPost { id: string; title: string; platform: string; scheduledFor: string; status: string; aiEnabled: boolean }
interface SocialAccount { id: string; name: string; platform: string; enabled: boolean; hasCredentials?: boolean }

const INITIAL_STATS: Stats = { services: 0, blogPosts: 0, testimonials: 0, contactForms: 0, orders: 0 }
const metricCards = [
  { key: 'services' as const, label: 'Services', description: 'Published offerings', icon: Briefcase, tone: 'text-blue-500', href: '/admin/services' },
  { key: 'blogPosts' as const, label: 'Blog posts', description: 'Editorial library', icon: FileText, tone: 'text-violet-500', href: '/admin/blog' },
  { key: 'testimonials' as const, label: 'Testimonials', description: 'Client proof points', icon: MessageSquare, tone: 'text-emerald-500', href: '/admin/testimonials' },
  { key: 'contactForms' as const, label: 'Inquiries', description: 'Contact submissions', icon: Mail, tone: 'text-orange-500', href: '/admin/contact' },
  { key: 'orders' as const, label: 'Orders', description: 'Service engagements', icon: ClipboardList, tone: 'text-cyan-500', href: '/admin/orders' },
]
const actions = [
  { label: 'Write a blog post', description: 'Create or generate a draft', href: '/admin/blog/new', icon: FileText, tone: 'bg-violet-500/10 text-violet-500' },
  { label: 'Schedule content', description: 'Plan an AI-powered post', href: '/admin/social', icon: CalendarClock, tone: 'bg-blue-500/10 text-blue-500' },
  { label: 'Create a service', description: 'Add a new offering', href: '/admin/services/new', icon: Briefcase, tone: 'bg-emerald-500/10 text-emerald-500' },
  { label: 'Open video clipper', description: 'Turn footage into clips', href: '/admin/video', icon: Film, tone: 'bg-pink-500/10 text-pink-500' },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function DashboardSkeleton() {
  return <div className="space-y-6 animate-pulse"><div className="h-28 rounded-2xl bg-muted/60" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-32 rounded-2xl bg-muted/60" />)}</div><div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><div className="h-80 rounded-2xl bg-muted/60" /><div className="h-80 rounded-2xl bg-muted/60" /></div></div>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(INITIAL_STATS)
  const [scheduled, setScheduled] = useState<ScheduledPost[]>([])
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setLoadError('')
    try {
      const requests = await Promise.all(['/api/services', '/api/blog/posts', '/api/testimonials', '/api/contact', '/api/orders', '/api/scheduled-posts?limit=6&status=scheduled&sortBy=scheduledFor&sortOrder=asc', '/api/social-accounts'].map((url) => fetch(url)))
      if (requests.some((response) => !response.ok)) throw new Error('Unable to load dashboard data')
      const data = await Promise.all(requests.map((response) => response.json()))
      setStats({ services: data[0].data?.length || 0, blogPosts: data[1].data?.length || 0, testimonials: data[2].data?.length || 0, contactForms: data[3].data?.length || 0, orders: data[4].data?.length || 0 })
      setScheduled(data[5].data || [])
      setAccounts(data[6].data || [])
    } catch {
      setLoadError('Some dashboard data could not be loaded. Try refreshing.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])
  if (loading) return <DashboardSkeleton />

  const connectedAccounts = accounts.filter((account) => account.enabled && account.hasCredentials).length
  const failedAccounts = accounts.filter((account) => account.enabled && !account.hasCredentials).length

  return <div className="mx-auto max-w-[1500px] space-y-6 pb-8">
    <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.16] via-card to-card p-6 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary"><Activity className="h-4 w-4" /> Operations center</div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good to see you.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">A focused view of your content, client activity, and publishing pipeline.</p></div><div className="flex flex-wrap gap-3"><button type="button" onClick={() => fetchDashboard(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-lg border bg-background/70 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh</button><Link href="/admin/social" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"><Plus className="h-4 w-4" /> New schedule</Link></div></div>
    </header>

    {loadError && <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"><span>{loadError}</span><button type="button" onClick={() => fetchDashboard(true)} className="font-semibold underline">Retry</button></div>}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Content metrics">{metricCards.map((card) => { const Icon = card.icon; return <Link key={card.key} href={card.href} className="group rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"><div className="flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${card.tone}`}><Icon className="h-5 w-5" /></div><ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></div><p className="mt-5 text-3xl font-bold tracking-tight">{stats[card.key]}</p><div className="mt-1 flex items-center justify-between gap-2"><p className="text-sm font-medium">{card.label}</p><span className="text-xs text-muted-foreground">{card.description}</span></div></Link> })}</section>

    <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="rounded-2xl border bg-card shadow-sm"><div className="flex items-center justify-between border-b px-5 py-4 sm:px-6"><div><h2 className="font-semibold">Publishing pipeline</h2><p className="mt-1 text-xs text-muted-foreground">Upcoming content waiting to go live</p></div><Link href="/admin/social" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Open scheduler <ChevronRight className="h-3.5 w-3.5" /></Link></div>{scheduled.length === 0 ? <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><CalendarClock className="h-6 w-6" /></div><p className="font-medium">Your queue is clear</p><p className="mt-1 max-w-sm text-sm text-muted-foreground">Schedule an AI-generated blog or social post to keep your publishing engine moving.</p><Link href="/admin/social" className="mt-4 text-sm font-semibold text-primary hover:underline">Create a schedule</Link></div> : <div className="divide-y">{scheduled.map((post) => <div key={post.id} className="flex items-center gap-4 px-5 py-4 sm:px-6"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500"><CalendarClock className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{post.title || 'Untitled post'}</p><p className="mt-1 text-xs text-muted-foreground"><span className="uppercase">{post.platform}</span> · {formatDate(post.scheduledFor)}</p></div><span className="hidden items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-500 sm:inline-flex">{post.aiEnabled && <Sparkles className="h-3 w-3" />} Scheduled</span></div>)}</div>}</div>
      <div className="rounded-2xl border bg-card shadow-sm"><div className="border-b px-5 py-4 sm:px-6"><h2 className="font-semibold">System health</h2><p className="mt-1 text-xs text-muted-foreground">Configuration and publishing readiness</p></div><div className="space-y-4 p-5 sm:p-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500"><ShieldCheck className="h-4 w-4" /></div><div className="flex-1"><p className="text-sm font-medium">Admin system</p><p className="text-xs text-muted-foreground">Authenticated and operational</p></div><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-500"><Users className="h-4 w-4" /></div><div className="flex-1"><p className="text-sm font-medium">Connected channels</p><p className="text-xs text-muted-foreground">{connectedAccounts} ready to publish</p></div>{failedAccounts > 0 ? <XCircle className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}</div><div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4"><div className="flex items-start gap-3"><Settings2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm font-medium">Keep the pipeline ready</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Connect publishing accounts and configure AI from Settings before scheduling external posts.</p><Link href="/admin/settings" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Review settings <ArrowUpRight className="h-3 w-3" /></Link></div></div></div></div></div>
    </section>

    <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="font-semibold">Quick actions</h2><p className="mt-1 text-xs text-muted-foreground">Common work, one click away</p></div><div className="grid gap-3 sm:grid-cols-2">{actions.map((action) => { const Icon = action.icon; return <Link key={action.href} href={action.href} className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.tone}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{action.label}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{action.description}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></Link> })}</div></div><div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><h2 className="font-semibold">Workspace snapshot</h2><p className="mt-1 text-xs text-muted-foreground">Useful areas to review today</p></div><ClipboardList className="h-5 w-5 text-muted-foreground" /></div><div className="mt-5 grid grid-cols-2 gap-3"><Link href="/admin/contact" className="rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"><p className="text-2xl font-bold">{stats.contactForms}</p><p className="mt-1 text-xs text-muted-foreground">Open inquiries</p></Link><Link href="/admin/orders" className="rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"><p className="text-2xl font-bold">{stats.orders}</p><p className="mt-1 text-xs text-muted-foreground">Client orders</p></Link><Link href="/admin/blog" className="rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"><p className="text-2xl font-bold">{stats.blogPosts}</p><p className="mt-1 text-xs text-muted-foreground">Editorial posts</p></Link><Link href="/admin/settings" className="rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"><p className="text-2xl font-bold">{connectedAccounts}</p><p className="mt-1 text-xs text-muted-foreground">Ready channels</p></Link></div></div></section>
  </div>
}
