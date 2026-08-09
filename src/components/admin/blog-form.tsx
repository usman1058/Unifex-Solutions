'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface BlogFormData {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  readTime: number
  sharePlacement: 'hero' | 'sidebar' | 'after-excerpt' | 'after-content'
  featured: boolean
  published: boolean
}

interface BlogFormProps {
  post?: any
  isEditing?: boolean
}

export default function BlogForm({ post, isEditing = false }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  const [formData, setFormData] = useState<BlogFormData>({
    slug: post?.slug || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    author: post?.author || '',
    readTime: post?.readTime || 5,
    sharePlacement: post?.sharePlacement || 'sidebar',
    featured: post?.featured || false,
    published: post?.published || false
  })

  const [selectedCategory, setSelectedCategory] = useState(post?.categoryId || '')
  const [tags, setTags] = useState<string[]>(post?.tags?.map((t: any) => t.name) || [''])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing
        ? `/api/blog/posts/${post.slug}`
        : '/api/blog/posts'

      const payload = {
        ...formData,
        categoryId: selectedCategory || null,
        tags: tags.filter(t => t.trim())
      }

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/blog')
      } else {
        setError(data.error?.message || 'Failed to save post')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateTag = (index: number, value: string) => {
    const updated = [...tags]
    updated[index] = value
    setTags(updated)
  }

  const addTag = () => {
    setTags([...tags, ''])
  }

  const removeTag = (index: number) => {
    const updated = tags.filter((_, i) => i !== index)
    setTags(updated)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Blog Post' : 'Create New Post'}
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
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-20 resize-none"
              placeholder="Brief summary of the post..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (HTML) *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-80 resize-none font-mono text-sm"
              placeholder="<p>Write your blog content here...</p>"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reading Time (minutes)</label>
              <input
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image URL</label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Share Buttons Placement</label>
            <select
              value={formData.sharePlacement}
              onChange={(e) => setFormData({ ...formData, sharePlacement: e.target.value as BlogFormData['sharePlacement'] })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="hero">Hero metadata row</option>
              <option value="sidebar">Article sidebar</option>
              <option value="after-excerpt">After article excerpt</option>
              <option value="after-content">After article content</option>
            </select>
            <p className="mt-2 text-xs text-muted-foreground">Choose where the social share row appears on the public article page.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Tag name"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-sm text-primary hover:underline"
              >
                + Add Tag
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Post'}
            </button>
            <Link
              href="/admin/blog"
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
