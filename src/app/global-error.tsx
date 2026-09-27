'use client'

import { useEffect } from 'react'
import ThemedErrorPage from '@/components/error/themed-error-page'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <ThemedErrorPage
          code={500}
          title="CRITICAL SYSTEM FAILURE"
          message="A CRITICAL ERROR OCCURRED. THE SYSTEM HAS LOGGED THE EXCEPTION AND OUR TEAM HAS BEEN NOTIFIED."
          showRetry
          onRetry={reset}
        />
      </body>
    </html>
  )
}
