'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  FileText,
  MessageSquare,
  Mail,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ClipboardList
} from 'lucide-react'

interface Stats {
  services: number
  blogPosts: number
  testimonials: number
  contactForms: number
  orders: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    blogPosts: 0,
    testimonials: 0,
    contactForms: 0,
    orders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [servicesRes, blogRes, testimonialsRes, contactRes, ordersRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/blog/posts'),
        fetch('/api/testimonials'),
        fetch('/api/contact'),
        fetch('/api/orders')
      ])

      const responses = [servicesRes, blogRes, testimonialsRes, contactRes, ordersRes]
      if (responses.some((response) => !response.ok)) {
        throw new Error('Unable to load dashboard data')
      }
      const [servicesData, blogData, testimonialsData, contactData, ordersData] = await Promise.all(
        responses.map((response) => response.json())
      )

      setStats({
        services: servicesData.data?.length || 0,
        blogPosts: blogData.data?.length || 0,
        testimonials: testimonialsData.data?.length || 0,
        contactForms: contactData.data?.length || 0,
        orders: ordersData.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Services',
      value: stats.services,
      icon: Briefcase,
      color: 'bg-blue-500',
      href: '/admin/services'
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      color: 'bg-purple-500',
      href: '/admin/blog'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      color: 'bg-green-500',
      href: '/admin/testimonials'
    },
    {
      title: 'Contact Forms',
      value: stats.contactForms,
      icon: Mail,
      color: 'bg-orange-500',
      href: '/admin/contact'
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ClipboardList,
      color: 'bg-cyan-500',
      href: '/admin/orders'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Operations center</p>
        <h1 className="text-3xl font-bold mb-2 sm:text-4xl">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Unifex Solutions admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <a
              key={card.title}
              href={card.href}
              className="block rounded-2xl border bg-card p-5 transition-shadow hover:shadow-lg sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${card.color} bg-opacity-10 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm text-muted-foreground">{card.title}</div>
            </a>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/services/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">Add New Service</div>
                <div className="text-sm text-muted-foreground">Create a new service listing</div>
              </div>
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">Write Blog Post</div>
                <div className="text-sm text-muted-foreground">Publish a new article</div>
              </div>
            </Link>
            <Link
              href="/admin/testimonials/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium">Add Testimonial</div>
                <div className="text-sm text-muted-foreground">Add a client review</div>
              </div>
            </Link>
            <Link
              href="/admin/contact"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium">View Contact Forms</div>
                <div className="text-sm text-muted-foreground">Check new inquiries</div>
              </div>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <ClipboardList className="w-5 h-5 text-cyan-500" />
              <div>
                <div className="font-medium">Review Orders</div>
                <div className="text-sm text-muted-foreground">Approve payments and track engagements</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">System Info</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Admin Users</div>
                <div className="font-medium">1 Active</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="font-medium">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">System Status</div>
                <div className="font-medium text-green-500">All Systems Operational</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="text-sm font-medium mb-2">Deployment note</div>
            <div className="text-xs leading-relaxed text-muted-foreground">
              Admin credentials and the session signing key are read from server environment variables.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
