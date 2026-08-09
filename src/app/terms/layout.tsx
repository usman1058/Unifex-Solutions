import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Terms of Service | Unifex Solutions', description: 'Review the terms that govern use of the Unifex Solutions website and services.', path: '/terms' })

export default function TermsLayout({ children }: { children: React.ReactNode }) { return children }
