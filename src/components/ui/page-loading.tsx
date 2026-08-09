"use client"

export default function PageLoading({ label = 'Loading experience' }: { label?: string }) {
  return (
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8 rounded-full border border-primary/20 p-2">
          <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <img src="/logo.webp" alt="Unifex Solutions" className="relative h-full w-full rounded-full object-cover shadow-[0_0_35px_rgba(249,115,22,0.32)]" />
        </div>
        <div className="flex items-center gap-2 justify-center">
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="mt-6 text-[10px] font-black tracking-[0.5em] text-on-surface/60 uppercase italic">
          {label}
        </p>
      </div>
    </main>
  )
}
