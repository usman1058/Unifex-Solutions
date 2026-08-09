import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({ title: 'Contact Unifex Solutions | Start a Digital Project', description: 'Tell Unifex what you are building, fixing, or securing and get a useful next step from our studio.', path: '/contact' })

export default function ContactLayout({ children }: { children: React.ReactNode }) { return children }
