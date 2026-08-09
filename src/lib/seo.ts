import type { Metadata } from 'next'

export const siteName = 'Unifex Solutions'
export const siteDescription = 'Unifex Solutions engineers high-performance websites, software products, secure systems, and digital growth experiences for ambitious teams.'
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
export const siteLogo = `${siteUrl}/logo.webp`

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

type SeoOptions = {
  title: string
  description: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function buildMetadata({ title, description, path = '/', image, type = 'website', noIndex = false }: SeoOptions): Metadata {
  const imageUrl = image ? (image.startsWith('http') ? image : absoluteUrl(image)) : siteLogo
  return {
    title,
    description,
    keywords: ['Unifex Solutions', 'web development', 'software development', 'cybersecurity', 'digital products'],
    alternates: { canonical: absoluteUrl(path) },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName,
      type,
      locale: 'en_US',
      images: [{ url: imageUrl, width: 675, height: 663, alt: `${siteName} logo` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}
