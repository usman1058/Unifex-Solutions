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
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center px-4 py-10 sm:p-8">
      <div className={`max-w-2xl w-full text-center border ${config.border} bg-surface-container-low p-6 sm:p-10 md:p-16 relative overflow-hidden`}>
        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border ${config.border} flex items-center justify-center mx-auto mb-8 md:mb-12 ${config.bg}`}>
          <Icon className={`h-10 w-10 md:h-12 md:w-12 ${config.color}`} />
        </div>

        <span className={`text-[10px] font-black tracking-[0.6em] ${config.color} mb-8 block uppercase italic`}>
          Error // {code}
        </span>

        <h1 className="break-words text-4xl sm:text-5xl md:text-7xl font-headline font-black leading-tight tracking-tighter uppercase mb-6 text-on-surface">
          {title}
        </h1>

        <p className="text-base font-medium tracking-normal text-on-surface-variant leading-relaxed mb-10">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="min-h-12 w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold text-xs tracking-[0.12em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-4 h-4" /> RETRY
            </button>
          )}

          <Link
            href="/"
            className="min-h-12 w-full sm:w-auto px-8 py-4 border border-outline-variant/40 text-on-surface font-bold text-xs tracking-[0.12em] uppercase hover:bg-surface-container-high transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-4 h-4" /> RETURN HOME
          </Link>
        </div>
      </div>
    </main>
  )
}
