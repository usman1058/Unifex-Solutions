'use client'

import { useEffect, useState } from 'react'
import {
  Loader2,
  CalendarClock,
  Plus,
  Sparkles,
  PlayCircle,
  Trash2,
  CheckCircle2,
  Clock,
  CheckCircle,
  XCircle,
  PenLine,
} from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  content: string
  topics?: string | null
  platform: string
  aiEnabled: boolean
  status: string
  scheduledFor: string
  publishedAt?: string | null
  error?: string | null
}

const PLATFORMS = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok', 'mastodon', 'blog']

const STATUS_LABELS: Record<string, { text: string; cls: string }> = {
  scheduled: { text: 'Scheduled', cls: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  processing: { text: 'Processing', cls: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
  published: { text: 'Published', cls: 'bg-green-500/10 text-green-500 border-green-500/30' },
  failed: { text: 'Failed', cls: 'bg-red-500/10 text-red-500 border-red-500/30' },
  cancelled: { text: 'Cancelled', cls: 'bg-gray-500/10 text-gray-500 border-gray-500/30' },
}

export default function AdminSocialPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState('')

  // new post form
  const [form, setForm] = useState({
    title: '',
    content: '',
    platform: 'twitter',
    date: '',
    time: '09:00',
    aiEnabled: true,
    topics: '',
  })

  const loadPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/scheduled-posts?limit=50')
      const data = await res.json()
      setPosts(data.success ? (data.data || []) : [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date) return
    const scheduledFor = new Date(`${form.date}T${form.time || '09:00'}`)
    const topics = form.topics
      ? form.topics.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    const res = await fetch('/api/scheduled-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        platform: form.platform,
        scheduledFor: scheduledFor.toISOString(),
        aiEnabled: form.aiEnabled,
        topics,
      }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      setShowNew(false)
      setForm({ title: '', content: '', platform: 'instagram', date: '', time: '09:00', aiEnabled: true, topics: '' })
      loadPosts()
    } else {
      setRunning(data.error?.message || 'Failed to schedule post')
    }
  }

  const handleRunNow = async () => {
    setRunning(true)
    setRunResult('')
    try {
      const res = await fetch('/api/scheduled-posts/run', { method: 'POST' })
      const data = await res.json()
      setRunResult(
        data.success
          ? `Published ${data.data?.published?.length || 0} post(s). ${data.data?.failed?.length ? data.data.failed.length + ' failed.' : ''}`
          : data.error?.message || 'No posts were due to publish.'
      )
      loadPosts()
    } catch {
      setRunResult('Error running the scheduler.')
    } finally {
      setRunning(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this scheduled post?')) return
    await fetch(`/api/scheduled-posts/${id}`, { method: 'DELETE' })
    loadPosts()
  }

  const handleCancel = async (id: string, status: string) => {
    const next = status === 'cancelled' ? 'scheduled' : 'cancelled'
    await fetch(`/api/scheduled-posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    loadPosts()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CalendarClock className="w-7 h-7" /> Social Scheduler
          </h1>
          <p className="text-muted-foreground">
            Schedule posts for your social channels. Toggle AI and content is auto-written &amp; published at the set time.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRunNow}
            disabled={running}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            Run due now
          </button>
          <button
            onClick={() => setShowNew(!showNew)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Schedule Post
          </button>
        </div>
      </div>

      {runResult && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/30 rounded-lg text-sm">{runResult}</div>
      )}

      {/* New post form */}
      {showNew && (
        <form onSubmit={handleCreate} className="mb-8 bg-card border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">New Scheduled Post</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Title / Topic</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. The Future of AI-Powered Security"
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Topics (comma separated)
              </label>
              <input
                value={form.topics}
                onChange={(e) => setForm({ ...form, topics: e.target.value })}
                placeholder="software trends, cybersecurity, cloud architecture"
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm"
                disabled={!form.aiEnabled}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> AI Auto-Generate
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, aiEnabled: !form.aiEnabled })}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                  form.aiEnabled ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-muted border'
                }`}
              >
                {form.aiEnabled ? 'Enabled — generates latest content' : 'Disabled — uses manual content'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                required
                min={today}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          {!form.aiEnabled && (
            <div className="space-y-2 mt-4 md:col-span-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write the post content here (used when AI is disabled)."
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm resize-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2.5 text-sm">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              Schedule Post
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="border rounded-lg p-16 text-center bg-card">
          <CalendarClock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-bold mb-2">No scheduled posts</h3>
          <p className="text-muted-foreground">Schedule your first post to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-card border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="p-4 font-medium">Post</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Scheduled For</th>
                <th className="p-4 font-medium">AI</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const st = STATUS_LABELS[p.status] || STATUS_LABELS.scheduled
                const scheduledDate = new Date(p.scheduledFor)
                return (
                  <tr key={p.id} className="hover:bg-muted/40 border-b last:border-0">
                    <td className="p-4 max-w-[260px]">
                      <div className="font-medium truncate">{p.title}</div>
                      {p.topics && (
                        <div className="text-xs text-muted-foreground truncate">
                          {JSON.parse(p.topics).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="p-4 uppercase text-xs">{p.platform}</td>
                    <td className="p-4">
                      <div>{scheduledDate.toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">{scheduledDate.toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4">
                      {p.aiEnabled ? (
                        <Sparkles className="w-4 h-4 text-primary" />
                      ) : (
                        <PenLine className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${st.cls}`}>
                        {p.status === 'published' && <CheckCircle className="w-3 h-3" />}
                        {p.status === 'failed' && <XCircle className="w-3 h-3" />}
                        {p.status === 'scheduled' && <Clock className="w-3 h-3" />}
                        {st.text}
                      </span>
                      {p.error && <div className="text-[11px] text-red-500 mt-1 truncate max-w-[160px]" title={p.error}>{p.error}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCancel(p.id, p.status)}
                          disabled={p.status === 'processing'}
                          className="text-xs text-muted-foreground hover:text-primary"
                        >
                          {p.status === 'cancelled' ? 'Re-schedule' : 'Cancel'}
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}