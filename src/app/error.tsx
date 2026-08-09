'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertOctagon, RotateCcw } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Server / Database Error:', error)
  }, [error])

  return (
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center p-10">
      <div className="max-w-2xl w-full text-center border border-red-500/20 bg-surface-container-low p-16 relative overflow-hidden">
        <div className="w-24 h-24 rounded-full border border-red-500/30 flex items-center justify-center mx-auto mb-12 bg-red-500/5">
          <AlertOctagon className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tighter uppercase mb-6 text-on-surface">
          SIGNAL INTERRUPTED
        </h1>
        
        <p className="text-xs font-black tracking-[0.3em] text-on-surface/60 uppercase leading-relaxed mb-12 italic">
          AN ARCHITECTURAL QUERY ANOMALY OCCURRED. SYSTEM LOGS HAVE CAPTURED THE EXCEPTION.
        </p>

        {error.digest && (
          <div className="mb-12 p-4 bg-background border border-outline-variant/10 font-mono text-[10px] text-on-surface/40 uppercase tracking-widest">
            DIGEST ID // {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-10 py-5 bg-primary text-black font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-4 h-4" /> RETRY TRANSMISSION
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-5 border border-outline-variant/20 text-on-surface/70 font-black text-[10px] tracking-[0.4em] uppercase hover:bg-surface-container-high transition-all text-center"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </main>
  )
}
