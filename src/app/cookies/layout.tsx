import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Cookie Policy | Unifex Solutions', description: 'Learn how Unifex Solutions uses cookies, local storage, analytics, and advertising technologies.', path: '/cookies' })

export default function CookiesLayout({ children }: { children: React.ReactNode }) { return children }
