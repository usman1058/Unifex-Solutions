'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, ExternalLink, Languages, Loader2, ServerCog, Unplug } from 'lucide-react'

interface AutoClipState {
  configured: boolean
  connected: boolean
  url?: string
  language: string
}

export default function AutoClipPanel() {
  const [state, setState] = useState<AutoClipState>({ configured: false, connected: false, language: 'en' })
  const [loading, setLoading] = useState(true)

  const check = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/video/autoclip/health', { cache: 'no-store' })
      const data = await response.json()
      if (data.success) setState(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { check() }, [])

  return <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div><div className="mb-2 flex items-center gap-2 text-primary"><ServerCog className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">AutoClip engine</span></div><h2 className="text-2xl font-bold">AI highlight workstation</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Use the open-source AutoClip service for English highlight detection, transcript analysis, titles, subtitles, editing, and export. Your existing local browser clipper remains available below.</p></div>
      <div className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${state.connected ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-amber-500/30 bg-amber-500/10 text-amber-500'}`}>{state.connected ? <CheckCircle2 className="h-4 w-4" /> : <Unplug className="h-4 w-4" />}{state.connected ? 'Connected' : state.configured ? 'Offline' : 'Not configured'}</div>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-muted/30 p-4"><div className="flex items-center gap-2 text-sm font-medium"><Languages className="h-4 w-4 text-primary" /> Language</div><p className="mt-2 text-lg font-bold">English</p><p className="text-xs text-muted-foreground">Dashboard integration</p></div><div className="rounded-xl border bg-muted/30 p-4"><div className="flex items-center gap-2 text-sm font-medium"><ServerCog className="h-4 w-4 text-primary" /> Service</div><p className="mt-2 truncate text-sm font-bold">{state.url || 'Add URL in Settings'}</p><p className="text-xs text-muted-foreground">AutoClip web endpoint</p></div><div className="flex flex-col justify-between rounded-xl border bg-muted/30 p-4"><p className="text-sm text-muted-foreground">Need to connect AutoClip?</p><a href="https://github.com/zhouxiaoka/autoclip/blob/main/README-EN.md" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Read English guide <ExternalLink className="h-3.5 w-3.5" /></a></div></div>
    <div className="mt-5 flex flex-wrap gap-3">{state.connected && state.url && <a href={`${state.url}?lang=en`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><ExternalLink className="h-4 w-4" /> Open AutoClip in English</a>}<button type="button" onClick={check} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ServerCog className="h-4 w-4" />} Check connection</button></div>
    {state.connected && state.url && <div className="mt-6 overflow-hidden rounded-xl border bg-black"><iframe title="AutoClip English workspace" src={`${state.url}?lang=en`} className="h-[720px] w-full" allow="clipboard-read; clipboard-write" /></div>}
    {!state.configured && <p className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">Set the AutoClip web URL in Admin → Settings → AutoClip engine. Keep the interface language set to English.</p>}
  </section>
}
