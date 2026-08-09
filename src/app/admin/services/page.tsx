'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

interface Service {
  id: string
  slug: string
  title: string
  description: string
  published: boolean
  featured: boolean
  displayOrder: number
  createdAt: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      if (data.success) {
        setServices(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services/${slug}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setServices(services.filter(s => s.slug !== slug))
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleTogglePublished = async (service: Service) => {
    try {
      const response = await fetch(`/api/services/${service.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, published: !service.published })
      })
      if (response.ok) {
        setServices(services.map(s =>
          s.id === service.id ? { ...s, published: !s.published } : s
        ))
      }
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && service.published) ||
                         (filter === 'draft' && !service.published)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              All ({services.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg ${filter === 'published' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Published ({services.filter(s => s.published).length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg ${filter === 'draft' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Drafts ({services.filter(s => !s.published).length})
            </button>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Title</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Featured</th>
                <th className="text-left px-6 py-4 font-medium">Order</th>
                <th className="text-left px-6 py-4 font-medium">Created</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No services found
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="border-t hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{service.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(service)}
                        className="flex items-center gap-2 text-sm"
                      >
                        {service.published ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-green-500" />
                            <span className="text-green-500">Published</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground">Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {service.featured ? (
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                          Featured
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{service.displayOrder}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/services/${service.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-muted rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/services/${service.slug}`}
                          className="p-2 hover:bg-muted rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(service.slug)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
