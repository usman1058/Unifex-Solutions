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

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string
  published: boolean
  featured: boolean
  views: number
  publishedAt: string | null
  createdAt: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts')
      const data = await response.json()
      if (data.success) {
        setPosts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setPosts(posts.filter(p => p.slug !== slug))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, published: !post.published })
      })
      if (response.ok) {
        setPosts(posts.map(p =>
          p.id === post.id ? { ...p, published: !p.published } : p
        ))
      }
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && post.published) ||
                         (filter === 'draft' && !post.published)
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
          <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
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
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg ${filter === 'published' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Published ({posts.filter(p => p.published).length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg ${filter === 'draft' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              Drafts ({posts.filter(p => !p.published).length})
            </button>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Title</th>
                <th className="text-left px-6 py-4 font-medium">Author</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Views</th>
                <th className="text-left px-6 py-4 font-medium">Published</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No posts found
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{post.author}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(post)}
                        className="flex items-center gap-2 text-sm"
                      >
                        {post.published ? (
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
                    <td className="px-6 py-4 text-sm">{post.views}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-muted rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="p-2 hover:bg-muted rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
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
