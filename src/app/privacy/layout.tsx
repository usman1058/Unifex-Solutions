import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Privacy Policy | Unifex Solutions', description: 'Read how Unifex Solutions handles information, privacy, and data submitted through this website.', path: '/privacy' })

export default function PrivacyLayout({ children }: { children: React.ReactNode }) { return children }
