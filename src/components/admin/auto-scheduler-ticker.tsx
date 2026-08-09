'use client'

import { useEffect, useRef } from 'react'

// Periodically invokes the scheduler endpoint while the admin panel is open,
// so posts with aiEnabled publish automatically at their scheduled time.
export default function AutoSchedulerTicker({ intervalMs = 5 * 60 * 1000 }: { intervalMs?: number }) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const run = () => {
      fetch('/api/scheduled-posts/run', { method: 'POST' })
        .then((res) => res.json())
        .catch(() => {})
    }

    // Run once shortly after mount, then on an interval.
    const first = setTimeout(run, 15000)
    intervalRef.current = setInterval(run, intervalMs)

    return () => {
      clearTimeout(first)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [intervalMs])

  return null
}