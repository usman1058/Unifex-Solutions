import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Track an Order | Unifex Solutions',
  description: 'Check the status of a Unifex project order using your reference number and email address.',
  path: '/order/status',
  noIndex: true,
})

export default function OrderStatusLayout({ children }: { children: React.ReactNode }) {
  return children
}
