'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ToggleLeft,
  ToggleRight,
  Star
} from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number | null
  featured: boolean
  published: boolean
  displayOrder: number
  createdAt: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()
      if (data.success) {
        setTestimonials(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const handleTogglePublished = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...testimonial, published: !testimonial.published })
      })
      if (response.ok) {
        setTestimonials(testimonials.map(t =>
          t.id === testimonial.id ? { ...t, published: !t.published } : t
        ))
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
    }
  }

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && testimonial.published) ||
                         (filter === 'draft' && !testimonial.published)
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
          <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
          <p className="text-muted-foreground">Manage client testimonials</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search testimonials..."
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
              All ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg ${filter === 'published' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Published ({testimonials.filter(t => t.published).length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg ${filter === 'draft' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Drafts ({testimonials.filter(t => !t.published).length})
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No testimonials found
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <button
                  onClick={() => handleTogglePublished(testimonial)}
                  className="flex items-center gap-2 text-sm"
                >
                  {testimonial.published ? (
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
                {testimonial.featured && (
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {testimonial.rating && (
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                "{testimonial.content}"
              </p>

              <div className="mb-4">
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role} {testimonial.company && `• ${testimonial.company}`}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/testimonials/${testimonial.id}`}
                  className="flex-1 text-center px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
