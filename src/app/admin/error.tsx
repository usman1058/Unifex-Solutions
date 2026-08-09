'use client'

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-destructive">Workspace error</p>
        <h1 className="mt-3 text-2xl font-semibold">The admin view could not load.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Retry the page. If this continues, check the database connection and server logs.</p>
        <button onClick={() => reset()} className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Try again
        </button>
      </div>
    </div>
  )
}
