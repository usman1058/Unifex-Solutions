'use client'

import { useEffect, useState } from 'react'
import { Facebook, Linkedin, Loader2, Plus, Trash2, Youtube } from 'lucide-react'
import { toast } from 'sonner'

type Platform = 'facebook' | 'linkedin' | 'youtube'

interface Account {
  id: string
  platform: Platform
  name: string
  handle?: string | null
  enabled: boolean
  config?: { pageUrl?: string; pageId?: string; authorUrn?: string; webhookUrl?: string }
  hasCredentials?: boolean
}

const EMPTY = { platform: 'facebook' as Platform, name: '', handle: '', pageUrl: '', pageId: '', authorUrn: '', webhookUrl: '', accessToken: '', enabled: true }

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === 'facebook') return <Facebook className="w-4 h-4" />
  if (platform === 'linkedin') return <Linkedin className="w-4 h-4" />
  return <Youtube className="w-4 h-4" />
}

export default function SocialAccountSettings() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [form, setForm] = useState({ ...EMPTY })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/social-accounts')
      const data = await response.json()
      if (data.success) setAccounts(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const startEdit = (account: Account) => {
    setEditingId(account.id)
    setForm({ ...EMPTY, platform: account.platform, name: account.name, handle: account.handle || '', enabled: account.enabled, ...account.config })
    setOpen(true)
  }

  const reset = () => { setForm({ ...EMPTY }); setEditingId(null); setOpen(false) }

  const save = async () => {
    if (!form.name.trim()) return toast.error('Account name is required')
    setSaving(true)
    try {
      const config = { pageUrl: form.pageUrl, pageId: form.pageId, authorUrn: form.authorUrn, webhookUrl: form.webhookUrl, ...(form.accessToken ? { accessToken: form.accessToken } : {}) }
      const response = await fetch('/api/social-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId || undefined, platform: form.platform, name: form.name, handle: form.handle, enabled: form.enabled, config }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error?.message || 'Unable to save account')
      toast.success('Social account saved')
      reset()
      load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save account')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Remove this connected account?')) return
    const response = await fetch(`/api/social-accounts/${id}`, { method: 'DELETE' })
    if (response.ok) { toast.success('Account removed'); load() }
    else toast.error('Unable to remove account')
  }

  return (
    <section className="bg-card border rounded-lg p-6">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold">Social publishing accounts</h2>
          <p className="text-sm text-muted-foreground mt-1">Connect pages and channels used by the scheduler. Tokens are stored server-side and are never returned to this page.</p>
        </div>
        <button type="button" onClick={() => { setForm({ ...EMPTY }); setEditingId(null); setOpen(true) }} className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm whitespace-nowrap"><Plus className="w-4 h-4" /> Add account</button>
      </div>

      {open && <div className="border rounded-lg p-4 mt-5 space-y-4 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2 text-sm"><span className="font-medium">Platform</span><select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })} className="w-full bg-background border rounded-lg px-3 py-2.5"><option value="facebook">Facebook Page</option><option value="linkedin">LinkedIn Page/Profile</option><option value="youtube">YouTube workflow</option></select></label>
          <label className="space-y-2 text-sm"><span className="font-medium">Account name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Company page" className="w-full bg-background border rounded-lg px-3 py-2.5" /></label>
        </div>
        <label className="space-y-2 text-sm block"><span className="font-medium">Public page/channel URL</span><input type="url" value={form.pageUrl} onChange={(e) => setForm({ ...form, pageUrl: e.target.value })} placeholder="https://www.facebook.com/your-page" className="w-full bg-background border rounded-lg px-3 py-2.5" /></label>
        {form.platform === 'facebook' && <label className="space-y-2 text-sm block"><span className="font-medium">Facebook Page ID</span><input value={form.pageId} onChange={(e) => setForm({ ...form, pageId: e.target.value })} placeholder="Page ID from Meta Business Suite" className="w-full bg-background border rounded-lg px-3 py-2.5" /></label>}
        {form.platform === 'linkedin' && <label className="space-y-2 text-sm block"><span className="font-medium">LinkedIn author URN</span><input value={form.authorUrn} onChange={(e) => setForm({ ...form, authorUrn: e.target.value })} placeholder="urn:li:organization:123456" className="w-full bg-background border rounded-lg px-3 py-2.5" /></label>}
        {form.platform === 'youtube' && <label className="space-y-2 text-sm block"><span className="font-medium">YouTube publishing webhook</span><input type="url" value={form.webhookUrl} onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })} placeholder="https://your-video-worker.example/publish" className="w-full bg-background border rounded-lg px-3 py-2.5" /><span className="text-xs text-muted-foreground block">YouTube’s official API uploads videos, not plain blog articles. Use a webhook connected to your video workflow to turn the blog into a video and upload it.</span></label>}
        <label className="space-y-2 text-sm block"><span className="font-medium">Access token {accounts.some((account) => account.id === editingId && account.hasCredentials) ? '(leave blank to keep existing)' : ''}</span><input type="password" value={form.accessToken} onChange={(e) => setForm({ ...form, accessToken: e.target.value })} placeholder="Stored securely; never shown again" className="w-full bg-background border rounded-lg px-3 py-2.5" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Enabled for scheduler</label>
        <div className="flex justify-end gap-2"><button type="button" onClick={reset} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">{saving && <Loader2 className="w-4 h-4 animate-spin" />} Save account</button></div>
      </div>}

      {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> : accounts.length === 0 ? <p className="text-sm text-muted-foreground py-6">No publishing accounts connected yet.</p> : <div className="space-y-2 mt-5">{accounts.map((account) => <div key={account.id} className="flex items-center justify-between gap-4 border rounded-lg p-3"><div className="flex items-center gap-3 min-w-0"><span className="text-primary"><PlatformIcon platform={account.platform} /></span><div className="min-w-0"><p className="text-sm font-medium truncate">{account.name}</p><p className="text-xs text-muted-foreground">{account.platform} · {account.hasCredentials ? 'Credentials stored' : 'Credentials missing'} · {account.enabled ? 'Enabled' : 'Disabled'}</p></div></div><div className="flex items-center gap-2"><button type="button" onClick={() => startEdit(account)} className="text-xs px-2 py-1 border rounded">Edit</button><button type="button" onClick={() => remove(account.id)} className="text-red-500 p-1" aria-label={`Remove ${account.name}`}><Trash2 className="w-4 h-4" /></button></div></div>)}</div>}
    </section>
  )
}
