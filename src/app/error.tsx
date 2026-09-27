'use client'

import { useEffect } from 'react'
import ThemedErrorPage from '@/components/error/themed-error-page'

const ERROR_MESSAGES: Record<number, { title: string; message: string }> = {
  400: { title: 'BAD REQUEST', message: 'THE REQUEST COULD NOT BE PROCESSED. CHECK YOUR INPUT AND TRY AGAIN.' },
  401: { title: 'UNAUTHORIZED', message: 'AUTHENTICATION IS REQUIRED TO ACCESS THIS RESOURCE.' },
  403: { title: 'FORBIDDEN', message: 'YOU DO NOT HAVE PERMISSION TO ACCESS THIS RESOURCE.' },
  404: { title: 'PAGE NOT FOUND', message: 'THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST OR HAS BEEN MOVED.' },
  408: { title: 'REQUEST TIMEOUT', message: 'THE SERVER TIMED OUT WAITING FOR THE REQUEST. TRY AGAIN.' },
  429: { title: 'TOO MANY REQUESTS', message: 'YOU HAVE EXCEEDED THE RATE LIMIT. PLEASE WAIT AND TRY AGAIN.' },
  500: { title: 'SIGNAL INTERRUPTED', message: 'AN INTERNAL SERVER ERROR OCCURRED. SYSTEM LOGS HAVE CAPTURED THE EXCEPTION.' },
  502: { title: 'BAD GATEWAY', message: 'THE SERVER RECEIVED AN INVALID RESPONSE FROM AN UPSTREAM SERVICE.' },
  503: { title: 'SERVICE UNAVAILABLE', message: 'THE SERVER IS TEMPORARILY UNAVAILABLE. PLEASE TRY AGAIN LATER.' },
}

function getStatusCode(error: Error & { digest?: string }): number {
  const digest = error.digest?.toLowerCase() || ''
  if (digest.includes('400') || digest.includes('bad request')) return 400
  if (digest.includes('401') || digest.includes('unauthorized')) return 401
  if (digest.includes('403') || digest.includes('forbidden')) return 403
  if (digest.includes('404') || digest.includes('not found')) return 404
  if (digest.includes('408') || digest.includes('timeout')) return 408
  if (digest.includes('429') || digest.includes('too many')) return 429
  if (digest.includes('502') || digest.includes('bad gateway')) return 502
  if (digest.includes('503') || digest.includes('unavailable')) return 503
  return 500
}

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

  const code = getStatusCode(error)
  const config = ERROR_MESSAGES[code] || ERROR_MESSAGES[500]

  return (
    <ThemedErrorPage
      code={code}
      title={config.title}
      message={config.message}
      showRetry
      onRetry={reset}
    />
  )
}
