'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2, CheckCircle2, Bug, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Setting {
  id: string
  key: string
  value: string
  type: string
  category: string
  description?: string | null
}

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI (gpt-4o, gpt-4o-mini)' },
  { value: 'anthropic', label: 'Anthropic (Claude)' },
  { value: 'google', label: 'Google (Gemini)' },
  { value: 'custom', label: 'Custom / OpenAI-compatible' },
]

const DEFAULT_FIELDS = {
  ai_provider: { type: 'text', category: 'ai', description: 'Primary AI provider' },
  ai_api_key: { type: 'secret', category: 'ai', description: 'API key for the chosen provider' },
  ai_model: { type: 'text', category: 'ai', description: 'Model name, e.g. gpt-4o-mini or claude-3-5-sonnet' },
  ai_base_url: { type: 'text', category: 'ai', description: 'Optional custom base URL for custom providers' },
  ai_tone: { type: 'text', category: 'ai', description: 'Tone used for AI-generated content' },
  ai_brand: { type: 'text', category: 'ai', description: 'Your agency / brand name for AI context' },
  bank_account_name: { type: 'text', category: 'bank', description: 'Bank account holder / beneficiary name' },
  bank_account_number: { type: 'text', category: 'bank', description: 'Bank account number' },
  bank_sort_code: { type: 'text', category: 'bank', description: 'Bank sort code / routing number' },
  bank_iban: { type: 'text', category: 'bank', description: 'IBAN (international)' },
  bank_swift: { type: 'text', category: 'bank', description: 'SWIFT / BIC code' },
  bank_address: { type: 'text', category: 'bank', description: 'Bank address' },
  bank_instructions: { type: 'text', category: 'bank', description: 'Instructions shown to clients when making a transfer' },
} as const

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [clearingKey, setClearingKey] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings?unmask=true')
      const data = await res.json()
      const map: Record<string, string> = {}
      if (data.success && data.data) {
        for (const s of data.data) map[s.key] = s.value
      }
      // seed defaults
      for (const key of Object.keys(DEFAULT_FIELDS)) {
        if (map[key] === undefined) map[key] = ''
      }
      if (map.ai_tone === '') map.ai_tone = 'professional'
      if (map.ai_brand === '') map.ai_brand = 'Unifex Solutions'
      if (map.bank_account_name === '') map.bank_account_name = 'Unifex Solutions Ltd'
      setValues(map)
    } catch (e) {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const items = Object.entries(values)
        .filter(([, v]) => v !== '')
        .map(([key, value]) => {
          const meta = (DEFAULT_FIELDS as any)[key] || {
            type: 'text',
            category: 'ai',
            description: key,
          }
          return { key, value, type: meta.type, category: meta.category, description: meta.description }
        })
      if (items.length === 0) {
        setError('No settings to save.')
        return
      }
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setError(data.error?.message || 'Failed to save settings')
      }
    } catch (e) {
      setError('Network error while saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleClear = async (key: string) => {
    setClearingKey(key)
    try {
      await fetch('/api/settings?key=' + encodeURIComponent(key), { method: 'DELETE' }).catch(() => {})
      setValues((prev) => ({ ...prev, [key]: '' }))
    } finally {
      setClearingKey('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure AI integrations for automated content generation and social scheduling.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-500/10 text-red-500 text-sm rounded-lg">{error}</div>
      )}

      <div className="space-y-6">
        {/* AI Provider */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-1">AI Provider</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your API key powers the Auto-Post system. Keys are stored in the database only — never in the frontend.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <select
                value={values.ai_provider || 'openai'}
                onChange={(e) => setValues((prev) => ({ ...prev, ai_provider: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <input
                type="password"
                placeholder="sk-••••••••••••••••"
                value={values.ai_api_key || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, ai_api_key: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {values.ai_api_key && (
                <button
                  onClick={() => handleClear('ai_api_key')}
                  className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear stored key
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <input
                type="text"
                placeholder="gpt-4o-mini"
                value={values.ai_model || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, ai_model: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Base URL (optional)</label>
              <input
                type="text"
                placeholder="https://api.openai.com/v1"
                value={values.ai_base_url || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, ai_base_url: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <input
                  type="text"
                  placeholder="professional"
                  value={values.ai_tone || ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, ai_tone: e.target.value }))}
                  className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agency / Brand</label>
                <input
                  type="text"
                  placeholder="Unifex Solutions"
                  value={values.ai_brand || ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, ai_brand: e.target.value }))}
                  className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-1">Bank Account Details</h2>
          <p className="text-sm text-muted-foreground mb-6">
            These details are shown to clients on the checkout page when they pay by bank transfer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Holder Name</label>
              <input
                type="text"
                value={values.bank_account_name || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, bank_account_name: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Number</label>
              <input
                type="text"
                value={values.bank_account_number || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, bank_account_number: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Code / Routing</label>
              <input
                type="text"
                value={values.bank_sort_code || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, bank_sort_code: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">IBAN (optional)</label>
              <input
                type="text"
                value={values.bank_iban || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, bank_iban: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SWIFT / BIC (optional)</label>
              <input
                type="text"
                value={values.bank_swift || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, bank_swift: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Address (optional)</label>
              <input
                type="text"
                value={values.bank_address || ''}
                onChange={(e) => setValues((prev) => ({ ...prev, bank_address: e.target.value }))}
                className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Transfer Instructions</label>
            <textarea
              value={values.bank_instructions || ''}
              onChange={(e) => setValues((prev) => ({ ...prev, bank_instructions: e.target.value }))}
              rows={3}
              className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Test connection */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Bug className="w-5 h-5" /> Test AI Connection
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            After saving, verify your key works before scheduling AI posts.
          </p>
          <button
            onClick={async () => {
              setError('')
              setSaved(false)
              const res = await fetch('/api/scheduled-posts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'snippet', topics: ['pipeline test'], platform: 'twitter', maxChars: 10 }),
              })
              const data = await res.json()
              if (res.ok && data.success) setError('')
              else setError(data.error?.message || 'Connection failed. Check your API key.')
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-background border hover:bg-muted rounded-lg text-sm transition-colors"
          >
            <Loader2 className="w-4 h-4" /> Test connection
          </button>
        </div>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-6 mt-8 flex items-center justify-end gap-3 bg-card border rounded-xl p-4 shadow-lg">
        {saved && (
          <span className="inline-flex items-center gap-2 text-sm text-green-500">
            <CheckCircle2 className="w-4 h-4" /> Settings saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}