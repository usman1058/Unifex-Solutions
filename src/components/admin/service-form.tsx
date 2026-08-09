'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ServiceFormData {
  slug: string
  title: string
  description: string
  content: string
  icon: string
  imageUrl: string
  features: string[]
  techStack: string[]
  pricing: string
  featured: boolean
  displayOrder: number
  published: boolean
}

interface ServiceFormProps {
  service?: any
  isEditing?: boolean
}

export default function ServiceForm({ service, isEditing = false }: ServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<ServiceFormData>({
    slug: service?.slug || '',
    title: service?.title || '',
    description: service?.description || '',
    content: service?.content || '',
    icon: service?.icon || '',
    imageUrl: service?.imageUrl || '',
    features: service?.features || [''],
    techStack: service?.techStack || [''],
    pricing: service?.pricing || '',
    featured: service?.featured || false,
    displayOrder: service?.displayOrder || 0,
    published: service?.published || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing
        ? `/api/services/${service.slug}`
        : '/api/services'

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/services')
      } else {
        setError(data.error?.message || 'Failed to save service')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateArrayField = (
    field: 'features' | 'techStack',
    index: number,
    value: string
  ) => {
    const updated = [...formData[field]]
    updated[index] = value
    setFormData({ ...formData, [field]: updated })
  }

  const addArrayField = (field: 'features' | 'techStack') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    })
  }

  const removeArrayField = (field: 'features' | 'techStack', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: updated })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Service' : 'Create New Service'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  if (!isEditing) {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                    })
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (HTML) *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-64 resize-none font-mono text-sm"
              placeholder="<p>Write your content here...</p>"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="🌐"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateArrayField('features', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Feature description"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('features', index)}
                      className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('features')}
                className="text-sm text-primary hover:underline"
              >
                + Add Feature
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tech Stack</label>
            <div className="space-y-2">
              {formData.techStack.map((tech, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => updateArrayField('techStack', index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Technology name"
                  />
                  {formData.techStack.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('techStack', index)}
                      className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('techStack')}
                className="text-sm text-primary hover:underline"
              >
                + Add Technology
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pricing Information</label>
            <textarea
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-24 resize-none"
              placeholder="Pricing details..."
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
              <label htmlFor="featured" className="font-medium">Featured Service</label>
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
              {loading ? 'Saving...' : 'Save Service'}
            </button>
            <Link
              href="/admin/services"
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
