'use client'

import ThemedErrorPage from '@/components/error/themed-error-page'

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ThemedErrorPage
      code={500}
      title="WORKSPACE ERROR"
      message="THE ADMIN VIEW COULD NOT LOAD. RETRY THE PAGE. IF THIS CONTINUES, CHECK THE DATABASE CONNECTION AND SERVER LOGS."
      showRetry
      onRetry={reset}
    />
  )
}
