import Link from 'next/link'
import { ArrowLeft, RotateCcw, AlertOctagon, ShieldOff, FileWarning, ServerCrash, Lock, SearchX } from 'lucide-react'

interface ThemedErrorPageProps {
  code: number
  title: string
  message: string
  showRetry?: boolean
  onRetry?: () => void
}

const ERROR_CONFIG: Record<number, { icon: typeof AlertOctagon; color: string; bg: string; border: string }> = {
  400: { icon: FileWarning, color: 'text-yellow-500', bg: 'bg-yellow-500/5', border: 'border-yellow-500/20' },
  401: { icon: Lock, color: 'text-orange-500', bg: 'bg-orange-500/5', border: 'border-orange-500/20' },
  403: { icon: ShieldOff, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20' },
  404: { icon: SearchX, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
  408: { icon: AlertOctagon, color: 'text-yellow-500', bg: 'bg-yellow-500/5', border: 'border-yellow-500/20' },
  429: { icon: AlertOctagon, color: 'text-orange-500', bg: 'bg-orange-500/5', border: 'border-orange-500/20' },
  500: { icon: ServerCrash, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20' },
  502: { icon: ServerCrash, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20' },
  503: { icon: ServerCrash, color: 'text-yellow-500', bg: 'bg-yellow-500/5', border: 'border-yellow-500/20' },
}

export default function ThemedErrorPage({ code, title, message, showRetry, onRetry }: ThemedErrorPageProps) {
  const config = ERROR_CONFIG[code] || ERROR_CONFIG[500]
  const Icon = config.icon

  return (
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center p-10">
      <div className={`max-w-2xl w-full text-center border ${config.border} bg-surface-container-low p-16 relative overflow-hidden`}>
        <div className={`w-24 h-24 rounded-full border ${config.border} flex items-center justify-center mx-auto mb-12 ${config.bg}`}>
          <Icon className={`w-12 h-12 ${config.color}`} />
        </div>

        <span className={`text-[10px] font-black tracking-[0.6em] ${config.color} mb-8 block uppercase italic`}>
          Error // {code}
        </span>

        <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter uppercase mb-6 text-on-surface">
          {title}
        </h1>

        <p className="text-xs font-black tracking-[0.3em] text-on-surface/60 uppercase leading-relaxed mb-12 italic">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-black font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-4 h-4" /> RETRY
            </button>
          )}

          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-5 border border-outline-variant/20 text-on-surface/70 font-black text-[10px] tracking-[0.4em] uppercase hover:bg-surface-container-high transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-4 h-4" /> RETURN HOME
          </Link>
        </div>
      </div>
    </main>
  )
}
