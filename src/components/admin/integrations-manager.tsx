'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, Plug, Power, PowerOff } from 'lucide-react'

interface Integration {
  id: string
  name: string
  type: string
  config: string
  description: string | null
  enabled: boolean
  createdAt: string
  updatedAt: string
}

const INTEGRATION_TYPES = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google Gemini' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'mailchimp', label: 'Mailchimp' },
  { value: 'slack', label: 'Slack' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'custom', label: 'Custom' },
]

export default function IntegrationsManager() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'openai',
    config: '{}',
    description: '',
    enabled: true,
  })

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/integrations')
      const data = await res.json()
      if (data.success) setIntegrations(data.data || [])
    } catch {
      toast.error('Load Failed', { description: 'Could not load integrations.' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ name: '', type: 'openai', config: '{}', description: '', enabled: true })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (integration: Integration) => {
    setForm({
      name: integration.name,
      type: integration.type,
      config: integration.config,
      description: integration.description || '',
      enabled: integration.enabled,
    })
    setEditingId(integration.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editingId ? `/api/integrations/${editingId}` : '/api/integrations'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(editingId ? 'Integration Updated' : 'Integration Created', {
          description: `"${form.name}" has been ${editingId ? 'updated' : 'created'} successfully.`,
        })
        resetForm()
        fetchIntegrations()
      } else {
        toast.error('Save Failed', { description: data.error?.message || 'Could not save integration.' })
      }
    } catch {
      toast.error('Save Failed', { description: 'An unexpected error occurred.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete integration "${name}"?`)) return
    try {
      const res = await fetch(`/api/integrations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Integration Deleted', { description: `"${name}" has been removed.` })
        fetchIntegrations()
      } else {
        toast.error('Delete Failed', { description: 'Could not delete the integration.' })
      }
    } catch {
      toast.error('Delete Failed', { description: 'An unexpected error occurred.' })
    }
  }

  const handleToggle = async (integration: Integration) => {
    try {
      const res = await fetch(`/api/integrations/${integration.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !integration.enabled }),
      })
      if (res.ok) {
        toast.success(integration.enabled ? 'Integration Disabled' : 'Integration Enabled', {
          description: `"${integration.name}" is now ${integration.enabled ? 'disabled' : 'enabled'}.`,
        })
        fetchIntegrations()
      } else {
        toast.error('Toggle Failed', { description: 'Could not update the integration.' })
      }
    } catch {
      toast.error('Toggle Failed', { description: 'An unexpected error occurred.' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plug className="w-5 h-5" /> Integrations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect third-party services. Manage API keys, webhooks, and credentials here — no code changes needed.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Integration
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 mb-4 bg-muted/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="My OpenAI Integration"
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {INTEGRATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Configuration (JSON)</label>
            <textarea
              value={form.config}
              onChange={(e) => setForm({ ...form, config: e.target.value })}
              rows={4}
              placeholder='{"apiKey": "sk-...", "model": "gpt-4o"}'
              className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this integration for?"
              className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="rounded"
              />
              Enabled
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {integrations.length === 0 && !showForm ? (
        <div className="text-center py-8 text-muted-foreground">
          <Plug className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No integrations configured yet.</p>
          <p className="text-xs mt-1">Add your first integration to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integration.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Plug className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{integration.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-muted capitalize">{integration.type}</span>
                  </div>
                  {integration.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{integration.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(integration)}
                  className={`p-2 rounded-lg transition-colors ${integration.enabled ? 'text-green-500 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-muted'}`}
                  title={integration.enabled ? 'Disable' : 'Enable'}
                >
                  {integration.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(integration)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(integration.id, integration.name)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
