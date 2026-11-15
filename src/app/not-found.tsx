import ThemedErrorPage from '@/components/error/themed-error-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | Unifex Solutions',
  description: 'The page you requested could not be found.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <ThemedErrorPage
      code={404}
      title="PAGE NOT FOUND"
      message="THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST OR HAS BEEN MOVED."
    />
  )
}
