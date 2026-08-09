'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'

interface TestimonialFormData {
  name: string
  role: string
  company: string
  content: string
  avatarUrl: string
  rating: number
  featured: boolean
  displayOrder: number
  published: boolean
}

interface TestimonialFormProps {
  testimonial?: any
  isEditing?: boolean
}

export default function TestimonialForm({ testimonial, isEditing = false }: TestimonialFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    company: testimonial?.company || '',
    content: testimonial?.content || '',
    avatarUrl: testimonial?.avatarUrl || '',
    rating: testimonial?.rating || 5,
    featured: testimonial?.featured || false,
    displayOrder: testimonial?.displayOrder || 0,
    published: testimonial?.published || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing
        ? `/api/testimonials/${testimonial.id}`
        : '/api/testimonials'

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/testimonials')
      } else {
        setError(data.error?.message || 'Failed to save testimonial')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/testimonials" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Testimonials
        </Link>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Client Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="CEO, Manager, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Testimonial Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-32 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Star
                    className={`w-8 h-8 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL</label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="font-medium">Featured</label>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="font-medium">Published</label>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Testimonial'}
            </button>
            <Link
              href="/admin/testimonials"
              className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
